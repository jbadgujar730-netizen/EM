-- MECHVORTEX 2026 Database Schema for Supabase PostgreSQL
-- Department of Mechanical Engineering, Sandip Institute of Technology & Research Centre (SITRC), Nashik

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    rules TEXT NOT NULL,
    fee NUMERIC NOT NULL CHECK (fee >= 0),
    registration_type TEXT NOT NULL CHECK (registration_type IN ('individual', 'team')),
    min_team_size INT NOT NULL DEFAULT 1,
    max_team_size INT NOT NULL DEFAULT 1,
    coordinator_name TEXT NOT NULL,
    coordinator_phone TEXT NOT NULL,
    registration_open BOOLEAN NOT NULL DEFAULT true,
    event_date TEXT DEFAULT '13th & 14th September 2026',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Registrations Table
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id TEXT UNIQUE NOT NULL, -- e.g. MVX-2026-000001
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE RESTRICT,
    event_name TEXT NOT NULL,
    registration_type TEXT NOT NULL,
    team_name TEXT,
    leader_name TEXT NOT NULL,
    leader_email TEXT NOT NULL,
    leader_mobile TEXT NOT NULL,
    college TEXT NOT NULL,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    division TEXT,
    amount NUMERIC NOT NULL,
    utr TEXT UNIQUE NOT NULL,
    payment_screenshot_path TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'Pending Verification' CHECK (payment_status IN ('Pending Verification', 'Verified', 'Rejected')),
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    verified_at TIMESTAMPTZ,
    verified_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    mobile TEXT,
    college TEXT,
    department TEXT,
    year TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Admin Profiles Table
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'coordinator')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL DEFAULT 'MECHVORTEX 2026',
    event_tagline TEXT NOT NULL DEFAULT 'Engineering • Sports • Creativity • Gaming',
    event_description TEXT DEFAULT 'National Level Technical & Cultural Event organized by the Department of Mechanical Engineering at Sandip Institute of Technology & Research Centre (SITRC), Nashik.',
    start_date TEXT NOT NULL DEFAULT '13 September 2026',
    end_date TEXT NOT NULL DEFAULT '14 September 2026',
    venue TEXT NOT NULL DEFAULT 'Department of Mechanical Engineering, D-Building, SITRC, Nashik',
    upi_id TEXT NOT NULL DEFAULT 'Not configured',
    qr_code_path TEXT NOT NULL DEFAULT 'Not configured',
    payment_instructions TEXT DEFAULT '1. Scan the QR code using any UPI application.\n2. Pay the exact registration amount.\n3. Complete the payment.\n4. Copy the UTR / Transaction ID.\n5. Upload the payment screenshot.\n6. Submit the registration.',
    contact_email TEXT DEFAULT 'mechvortex@sitrc.ac.in',
    contact_phone TEXT DEFAULT '8446058699',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_registrations_utr ON public.registrations(utr);
CREATE INDEX IF NOT EXISTS idx_registrations_regid ON public.registrations(registration_id);
CREATE INDEX IF NOT EXISTS idx_team_members_reg_id ON public.team_members(registration_id);

-- Row Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS: Events
-- Public can read all events
CREATE POLICY "Public can view events" ON public.events
    FOR SELECT USING (true);

-- Only authenticated admins can modify events
CREATE POLICY "Admins can modify events" ON public.events
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

-- RLS: Site Settings
-- Public can view site settings
CREATE POLICY "Public can view site settings" ON public.site_settings
    FOR SELECT USING (true);

-- Admins can update site settings
CREATE POLICY "Admins can update site settings" ON public.site_settings
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

-- RLS: Registrations
-- Anyone can insert registration (public submission)
CREATE POLICY "Public can submit registrations" ON public.registrations
    FOR INSERT WITH CHECK (true);

-- Admins can view and update all registrations
CREATE POLICY "Admins can view all registrations" ON public.registrations
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update registrations" ON public.registrations
    FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

-- RLS: Team Members
CREATE POLICY "Public can submit team members" ON public.team_members
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view team members" ON public.team_members
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

-- Storage Bucket Setup for private payment proofs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-proofs', 'payment-proofs', false) 
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public can upload proofs, only admins can view
CREATE POLICY "Public can upload payment proofs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Only admins can view payment proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'payment-proofs' AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

-- SEED DATA: 9 Initial Events
INSERT INTO public.events (slug, name, category, description, rules, fee, registration_type, min_team_size, max_team_size, coordinator_name, coordinator_phone, registration_open)
VALUES
(
    'technical-paper',
    'Technical Paper Presentation',
    'Engineering',
    'Present your innovative research, engineering breakthroughs, or technological reviews in front of esteemed industry and academic jurors.',
    '1. Standard IEEE or college format.\n2. Maximum 10 minutes presentation + 3 minutes Q&A.\n3. Bring PPT on a clean flash drive and carry 2 printed copies.\n4. Judge decisions will be final.',
    75,
    'individual',
    1,
    1,
    'Pranav',
    '8446058699',
    true
),
(
    'aptitude-quiz',
    'Aptitude Rapid Fire Quiz',
    'Engineering',
    'Test your quantitative aptitude, logical reasoning, and rapid decision-making skills against the sharpest minds across colleges.',
    '1. Individual competition.\n2. Round 1: Written screening test (30 mins).\n3. Round 2: Rapid-fire buzzer round on stage.\n4. Negative marking applicable for Round 2.',
    50,
    'individual',
    1,
    1,
    'Tanmay Kaklij',
    '8421433316',
    true
),
(
    'treasure-hunt',
    'Technical Treasure Hunt',
    'Engineering',
    'Crack technical riddles, decode mechanical engineering blueprints, and navigate SITRC campus checkpoints to uncover the final vault.',
    '1. Exactly 2 members per team.\n2. Total 5 progressive clue checkpoints across the campus.\n3. Clues involve technical puzzles and mechanical fundamentals.\n4. Fastest team to decrypt all clues wins.',
    100,
    'team',
    2,
    2,
    'Mansi Pawar',
    '9284740932',
    true
),
(
    'free-fire',
    'Free Fire Tournament',
    'Gaming',
    'Deploy your squad in the ultimate Battle Royale showdown on Bermuda/Purgatory. Showcase strategy, precision, and team coordination.',
    '1. Squad tournament (configurable 4 members).\n2. Custom room match rules will be shared on the official WhatsApp group.\n3. Emulators are strictly prohibited; mobile phones only.\n4. Toxicity, hacking, or glitches will lead to immediate disqualification.',
    200,
    'team',
    4,
    4,
    'Abhilash Shinde',
    '9833765725',
    true
),
(
    'chess',
    'Chess',
    'Sports',
    'Battle of intellect and strategy on 64 squares. FIDE blitz/rapid time control format for true grandmaster spirits.',
    '1. Individual classical/rapid tournament.\n2. Swiss-league format followed by knockout semifinals.\n3. Time control: 15 minutes + 5 seconds increment per player.\n4. Touch-move rule strictly applied.',
    50,
    'individual',
    1,
    1,
    'Suyash Patil',
    '8766532190',
    true
),
(
    'neon-cricket',
    'Neon Cricket',
    'Sports',
    'Experience box cricket in an electrified glow-in-the-dark neon arena. Fast-paced, thrilling, with special neon power plays.',
    '1. 5 players per team.\n2. Box cricket rules with fluorescent balls and boundary nets.\n3. 4 overs per innings.\n4. Highest aggregate run score advances to tournament knockout.',
    75,
    'team',
    5,
    5,
    'Kunal Deshmukh',
    '9657412308',
    true
),
(
    'poster',
    'Poster Competition',
    'Creativity',
    'Express engineering innovations, sustainable green technology, or industrial automation through compelling visual poster artistry.',
    '1. Individual competition.\n2. Standard A2/A3 chart or digital print display.\n3. Topic themes: Green Energy, Smart Manufacturing, Future Robotics.\n4. Originality and visual clarity carry maximum marks.',
    75,
    'individual',
    1,
    1,
    'Sneha Patil',
    '9405023387',
    true
),
(
    'cad-war',
    'CAD War',
    'Engineering',
    'Race against the clock to design complex 3D mechanical components and assemblies using industry CAD software (AutoCAD / SolidWorks / Creo).',
    '1. Exactly 2 members per team.\n2. Problem statement provided at the beginning of the lab round.\n3. Modeling precision, geometric tolerances, and completion time decide rankings.\n4. Workstations provided with SolidWorks/AutoCAD.',
    150,
    'team',
    2,
    2,
    'Om Jadhav',
    '8767991234',
    true
),
(
    'ideapitch',
    'IdeaPitch (Kumbh Mela)',
    'Creativity / Innovation',
    'Pitch scalable tech solutions for crowd management, sanitation, logistics, security, and sustainability for the upcoming mega Nashik Kumbh Mela.',
    '1. Teams of 2 to 4 members.\n2. 7 minutes pitch presentation + 3 minutes jury defense.\n3. Working prototype or feasibility architecture diagram earns bonus points.\n4. Jurors will assess social impact, technical feasibility, and scalability.',
    100,
    'team',
    2,
    4,
    'Rohit Gaikwad',
    '9321876541',
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Initial Site Settings
INSERT INTO public.site_settings (
    event_name,
    event_tagline,
    event_description,
    start_date,
    end_date,
    venue,
    upi_id,
    qr_code_path,
    contact_email,
    contact_phone
)
SELECT 
    'MECHVORTEX 2026',
    'Engineering • Sports • Creativity • Gaming',
    'National Technical and Cultural Festival organized by the Department of Mechanical Engineering, Sandip Institute of Technology & Research Centre (SITRC), Nashik. In association with MESA and IEI Student Chapter.',
    '13 September 2026',
    '14 September 2026',
    'Department of Mechanical Engineering, D-Building, SITRC, Nashik',
    'Not configured',
    'Not configured',
    'hiteshbadgujar.mech@sitrc.org',
    '7769829891'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

-- Initial Super Admin Seed
INSERT INTO public.admin_profiles (email, name, role)
VALUES ('hiteshbadgujar.mech@sitrc.org', 'Prof. Hitesh Badgujar (Super Admin)', 'super_admin')
ON CONFLICT (email) DO NOTHING;

