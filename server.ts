import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

// Directories for local persistent storage & file uploads
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PROOFS_DIR = path.join(UPLOADS_DIR, 'payment-proofs');
const QR_DIR = path.join(UPLOADS_DIR, 'qr-codes');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(PROOFS_DIR)) fs.mkdirSync(PROOFS_DIR, { recursive: true });
if (!fs.existsSync(QR_DIR)) fs.mkdirSync(QR_DIR, { recursive: true });

const DB_FILE = path.join(DATA_DIR, 'mechvortex_db.json');

// Supabase client initialization (if configured in env)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  : null;

// Initial 9 events
const INITIAL_EVENTS = [
  {
    id: 'e1-technical-paper',
    slug: 'technical-paper',
    name: 'Technical Paper Presentation',
    category: 'Engineering',
    description: 'Present your innovative research, engineering breakthroughs, or technological reviews in front of esteemed industry and academic jurors.',
    rules: '1. Standard IEEE or college format.\n2. Maximum 10 minutes presentation + 3 minutes Q&A.\n3. Bring PPT on a clean flash drive and carry 2 printed copies.\n4. Judge decisions will be final.',
    fee: 75,
    registration_type: 'individual',
    min_team_size: 1,
    max_team_size: 1,
    coordinator_name: 'Pranav',
    coordinator_phone: '8446058699',
    registration_open: true,
    event_date: '13th & 14th September 2026',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'e2-aptitude-quiz',
    slug: 'aptitude-quiz',
    name: 'Aptitude Rapid Fire Quiz',
    category: 'Engineering',
    description: 'Test your quantitative aptitude, logical reasoning, and rapid decision-making skills against the sharpest minds across colleges.',
    rules: '1. Individual competition.\n2. Round 1: Written screening test (30 mins).\n3. Round 2: Rapid-fire buzzer round on stage.\n4. Negative marking applicable for Round 2.',
    fee: 50,
    registration_type: 'individual',
    min_team_size: 1,
    max_team_size: 1,
    coordinator_name: 'Tanmay Kaklij',
    coordinator_phone: '8421433316',
    registration_open: true,
    event_date: '13th & 14th September 2026',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'e3-treasure-hunt',
    slug: 'treasure-hunt',
    name: 'Technical Treasure Hunt',
    category: 'Engineering',
    description: 'Crack technical riddles, decode mechanical engineering blueprints, and navigate SITRC campus checkpoints to uncover the final vault.',
    rules: '1. Exactly 2 members per team.\n2. Total 5 progressive clue checkpoints across the campus.\n3. Clues involve technical puzzles and mechanical fundamentals.\n4. Fastest team to decrypt all clues wins.',
    fee: 100,
    registration_type: 'team',
    min_team_size: 2,
    max_team_size: 2,
    coordinator_name: 'Mansi Pawar',
    coordinator_phone: '9284740932',
    registration_open: true,
    event_date: '13th & 14th September 2026',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'e4-free-fire',
    slug: 'free-fire',
    name: 'Free Fire Tournament',
    category: 'Gaming',
    description: 'Deploy your squad in the ultimate Battle Royale showdown on Bermuda/Purgatory. Showcase strategy, precision, and team coordination.',
    rules: '1. Squad tournament (configurable 4 members).\n2. Custom room match rules will be shared on the official WhatsApp group.\n3. Emulators are strictly prohibited; mobile phones only.\n4. Toxicity, hacking, or glitches will lead to immediate disqualification.',
    fee: 200,
    registration_type: 'team',
    min_team_size: 4,
    max_team_size: 4,
    coordinator_name: 'Abhilash Shinde',
    coordinator_phone: '9833765725',
    registration_open: true,
    event_date: '13th & 14th September 2026',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'e5-chess',
    slug: 'chess',
    name: 'Chess',
    category: 'Sports',
    description: 'Battle of intellect and strategy on 64 squares. FIDE rapid/blitz time control format for true grandmaster spirits.',
    rules: '1. Individual classical/rapid tournament.\n2. Swiss-league format followed by knockout semifinals.\n3. Time control: 15 minutes + 5 seconds increment per player.\n4. Touch-move rule strictly applied.',
    fee: 50,
    registration_type: 'individual',
    min_team_size: 1,
    max_team_size: 1,
    coordinator_name: 'Suyash Patil',
    coordinator_phone: '8766532190',
    registration_open: true,
    event_date: '13th & 14th September 2026',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'e6-neon-cricket',
    slug: 'neon-cricket',
    name: 'Neon Cricket',
    category: 'Sports',
    description: 'Experience box cricket in an electrified glow-in-the-dark neon arena. Fast-paced, thrilling, with special neon power plays.',
    rules: '1. 5 players per team.\n2. Box cricket rules with fluorescent balls and boundary nets.\n3. 4 overs per innings.\n4. Highest aggregate run score advances to tournament knockout.',
    fee: 75,
    registration_type: 'team',
    min_team_size: 5,
    max_team_size: 5,
    coordinator_name: 'Kunal Deshmukh',
    coordinator_phone: '9657412308',
    registration_open: true,
    event_date: '13th & 14th September 2026',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'e7-poster',
    slug: 'poster',
    name: 'Poster Competition',
    category: 'Creativity',
    description: 'Express engineering innovations, sustainable green technology, or industrial automation through compelling visual poster artistry.',
    rules: '1. Individual competition.\n2. Standard A2/A3 chart or digital print display.\n3. Topic themes: Green Energy, Smart Manufacturing, Future Robotics.\n4. Originality and visual clarity carry maximum marks.',
    fee: 75,
    registration_type: 'individual',
    min_team_size: 1,
    max_team_size: 1,
    coordinator_name: 'Sneha Patil',
    coordinator_phone: '9405023387',
    registration_open: true,
    event_date: '13th & 14th September 2026',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'e8-cad-war',
    slug: 'cad-war',
    name: 'CAD War',
    category: 'Engineering',
    description: 'Race against the clock to design complex 3D mechanical components and assemblies using industry CAD software (AutoCAD / SolidWorks / Creo).',
    rules: '1. Exactly 2 members per team.\n2. Problem statement provided at the beginning of the lab round.\n3. Modeling precision, geometric tolerances, and completion time decide rankings.\n4. Workstations provided with SolidWorks/AutoCAD.',
    fee: 150,
    registration_type: 'team',
    min_team_size: 2,
    max_team_size: 2,
    coordinator_name: 'Om Jadhav',
    coordinator_phone: '8767991234',
    registration_open: true,
    event_date: '13th & 14th September 2026',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'e9-ideapitch',
    slug: 'ideapitch',
    name: 'IdeaPitch (Kumbh Mela)',
    category: 'Creativity / Innovation',
    description: 'Pitch scalable tech solutions for crowd management, sanitation, logistics, security, and sustainability for the upcoming mega Nashik Kumbh Mela.',
    rules: '1. Teams of 2 to 4 members.\n2. 7 minutes pitch presentation + 3 minutes jury defense.\n3. Working prototype or feasibility architecture diagram earns bonus points.\n4. Jurors will assess social impact, technical feasibility, and scalability.',
    fee: 100,
    registration_type: 'team',
    min_team_size: 2,
    max_team_size: 4,
    coordinator_name: 'Rohit Gaikwad',
    coordinator_phone: '9321876541',
    registration_open: true,
    event_date: '13th & 14th September 2026',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const INITIAL_SETTINGS = {
  id: 'site-settings-main',
  event_name: 'MECHVORTEX 2026',
  event_tagline: 'Engineering • Sports • Creativity • Gaming',
  event_description: 'National Level Technical & Cultural Festival organized by the Department of Mechanical Engineering at Sandip Institute of Technology & Research Centre (SITRC), Nashik. In association with Mechanical Engineering Student Association (MESA) and Institution of Engineers India (IEI) Student Chapter.',
  start_date: '13 September 2026',
  end_date: '14 September 2026',
  venue: 'Department of Mechanical Engineering, D-Building, SITRC, Nashik',
  upi_id: 'Not configured',
  qr_code_path: 'Not configured',
  payment_instructions: '1. Scan the QR code using any UPI application.\n2. Pay the exact registration amount.\n3. Complete the payment.\n4. Copy the UTR / Transaction ID.\n5. Upload the payment screenshot.\n6. Submit the registration.',
  contact_email: 'hiteshbadgujar.mech@sitrc.org',
  contact_phone: '7769829891',
  updated_at: new Date().toISOString()
};

// Default Admin hash utility
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(`mechvortex_${password}`).digest('hex');
}

// Database state container
interface AuditLogItem {
  id: string;
  action: string;
  category: 'auth' | 'verification' | 'events' | 'settings';
  details: string;
  admin_name: string;
  admin_email: string;
  ip?: string;
  timestamp: string;
}

interface DBState {
  events: any[];
  registrations: any[];
  site_settings: typeof INITIAL_SETTINGS;
  admin_profiles: any[];
  registration_counter: number;
  audit_logs: AuditLogItem[];
}

// Super Admin credentials as specifically designated
const SUPER_ADMIN_EMAIL = 'hiteshbadgujar.mech@sitrc.org';
const SUPER_ADMIN_PASS = '@Hitesh0678';

function loadDB(): DBState {
  const superAdmin = {
    id: 'super-admin-root',
    email: SUPER_ADMIN_EMAIL,
    password_hash: hashPassword(SUPER_ADMIN_PASS),
    name: 'Prof. Hitesh Badgujar (Super Admin)',
    role: 'super_admin',
    approval_status: 'approved',
    approved_by: 'Master System',
    approved_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  };

  const defaultAdmin = {
    id: 'admin-1',
    email: 'admin@sitrc.ac.in',
    password_hash: hashPassword('Mechvortex@2026'),
    name: 'Event Administrator',
    role: 'admin',
    approval_status: 'approved',
    approved_by: 'Prof. Hitesh Badgujar',
    approved_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  };

  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      // Ensure all fields exist
      if (!data.events || !data.events.length) data.events = INITIAL_EVENTS;
      if (!data.site_settings) data.site_settings = INITIAL_SETTINGS;
      if (!data.registrations) data.registrations = [];
      if (!data.admin_profiles) data.admin_profiles = [];
      if (!data.audit_logs) data.audit_logs = [];
      if (typeof data.registration_counter !== 'number') data.registration_counter = data.registrations.length;

      // Ensure Super Admin hiteshbadgujar.mech@sitrc.org always exists with correct hash and role
      const sIndex = data.admin_profiles.findIndex(
        (u: any) => u.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
      );
      if (sIndex === -1) {
        data.admin_profiles.unshift(superAdmin);
      } else {
        data.admin_profiles[sIndex].password_hash = hashPassword(SUPER_ADMIN_PASS);
        data.admin_profiles[sIndex].role = 'super_admin';
        data.admin_profiles[sIndex].approval_status = 'approved';
        data.admin_profiles[sIndex].name = 'Prof. Hitesh Badgujar (Super Admin)';
      }

      // Ensure all other admins have approval_status defined
      data.admin_profiles.forEach((u: any) => {
        if (!u.approval_status) {
          u.approval_status = u.role === 'super_admin' ? 'approved' : 'approved';
        }
      });

      // Update official email and central helpline
      data.site_settings.contact_email = 'hiteshbadgujar.mech@sitrc.org';
      data.site_settings.contact_phone = '7769829891';

      saveDB(data);
      return data;
    } catch (e) {
      console.error('Error reading db file, re-initializing', e);
    }
  }

  // Initial DB state
  const initial: DBState = {
    events: INITIAL_EVENTS,
    registrations: [],
    site_settings: INITIAL_SETTINGS,
    admin_profiles: [superAdmin, defaultAdmin],
    registration_counter: 0,
    audit_logs: [
      {
        id: crypto.randomUUID(),
        action: 'System Initialized',
        category: 'settings',
        details: 'MECHVORTEX 2026 database system initialized. Super Admin: hiteshbadgujar.mech@sitrc.org',
        admin_name: 'Prof. Hitesh Badgujar',
        admin_email: SUPER_ADMIN_EMAIL,
        timestamp: new Date().toISOString()
      }
    ]
  };
  saveDB(initial);
  return initial;
}

function saveDB(data: DBState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save DB file', e);
  }
}

let db = loadDB();

function addAuditLog(
  action: string,
  category: 'auth' | 'verification' | 'events' | 'settings',
  details: string,
  adminName = 'System',
  adminEmail = 'admin@sitrc.ac.in',
  ip = '127.0.0.1'
) {
  if (!db.audit_logs) db.audit_logs = [];
  const log: AuditLogItem = {
    id: crypto.randomUUID(),
    action,
    category,
    details,
    admin_name: adminName,
    admin_email: adminEmail,
    ip,
    timestamp: new Date().toISOString()
  };
  db.audit_logs.unshift(log);
  // Keep last 500 logs
  if (db.audit_logs.length > 500) db.audit_logs.pop();
  saveDB(db);
  broadcastRealtime('audit_log_added', log);
}


// Server-Sent Events subscribers for Realtime updates
type SSEClient = {
  id: string;
  res: Response;
};
const realtimeClients: SSEClient[] = [];

function broadcastRealtime(event: string, payload: any) {
  const data = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
  realtimeClients.forEach(client => {
    try {
      client.res.write(`data: ${data}\n\n`);
    } catch {
      // client dropped
    }
  });
}

// Multer Storage Configuration
// 1. Payment screenshots (Private, max 5MB, JPG/JPEG/PNG/WEBP)
const proofStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, PROOFS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const rand = crypto.randomBytes(8).toString('hex');
    const cleanName = `proof_${Date.now()}_${rand}${ext}`;
    cb(null, cleanName);
  }
});

const uploadProof = multer({
  storage: proofStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Allowed formats: JPG, JPEG, PNG, WEBP.'));
    }
  }
});

// 2. QR Code uploads (Admin configurable)
const qrStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, QR_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    cb(null, `qr_mechvortex_${Date.now()}${ext}`);
  }
});

const uploadQr = multer({
  storage: qrStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Allowed formats: JPG, JPEG, PNG, WEBP.'));
    }
  }
});

// Simple secure session token store
const activeSessions = new Map<string, { email: string; name: string; role: string; expires: number }>();

function generateToken(user: any): string {
  const token = crypto.randomBytes(32).toString('hex');
  activeSessions.set(token, {
    email: user.email,
    name: user.name,
    role: user.role,
    expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });
  return token;
}

// Authentication middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin authentication required.' });
  }
  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);
  if (!session || session.expires < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid. Please login again.' });
  }
  (req as any).adminUser = session;
  next();
}

// Super Admin authorization middleware (strictly for hiteshbadgujar.mech@sitrc.org)
function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  requireAdmin(req, res, () => {
    const admin = (req as any).adminUser;
    if (admin.role !== 'super_admin' && admin.email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({
        error: 'Forbidden. Only Super Admin (hiteshbadgujar.mech@sitrc.org) is authorized to approve admin accounts.'
      });
    }
    next();
  });
}


app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Publicly serve QR code images
app.use('/uploads/qr-codes', express.static(QR_DIR));

// PUBLIC API: Get Site Settings
app.get('/api/settings', (_req, res) => {
  res.json(db.site_settings);
});

// PUBLIC API: Get all active events
app.get('/api/events', (_req, res) => {
  res.json(db.events);
});

// PUBLIC API: Get event by slug
app.get('/api/events/:slug', (req, res) => {
  const event = db.events.find(e => e.slug === req.params.slug);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json(event);
});

// PUBLIC API: Submit Registration
app.post('/api/register', uploadProof.single('payment_screenshot'), (req: Request, res: Response) => {
  try {
    const {
      event_id,
      event_slug,
      team_name,
      leader_name,
      leader_email,
      leader_mobile,
      college,
      department,
      year,
      division,
      utr,
      team_members: teamMembersRaw
    } = req.body;

    // 1. Validate File Upload
    if (!req.file) {
      return res.status(400).json({ error: 'Payment screenshot is required.' });
    }

    // 2. Fetch event dynamically from DB (Do NOT trust client fee)
    const event = db.events.find(e => e.id === event_id || e.slug === event_slug);
    if (!event) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Event not found.' });
    }

    // 3. Check if registration is open
    if (!event.registration_open) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Registration for this event is currently closed.' });
    }

    // 4. Validate Required Leader / Participant Fields
    if (!leader_name || !leader_email || !leader_mobile || !college || !department || !year || !utr) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'All personal, academic, and payment fields are required.' });
    }

    // 5. Validate Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leader_email.trim())) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // 6. Validate Indian Mobile (10 digits)
    const cleanMobile = leader_mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number.' });
    }

    // 7. Validate Duplicate UTR
    const cleanUTR = utr.trim().toUpperCase();
    if (cleanUTR.length < 6) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Please enter a valid UTR / Transaction ID (minimum 6 characters).' });
    }

    const existingUtr = db.registrations.find(r => r.utr.toUpperCase() === cleanUTR);
    if (existingUtr) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: 'This UTR has already been submitted. Please check your registration details.'
      });
    }

    // 8. Parse and Validate Team Members if team event
    let parsedMembers: any[] = [];
    if (event.registration_type === 'team') {
      if (!team_name || !team_name.trim()) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Team name is required for team events.' });
      }

      if (teamMembersRaw) {
        try {
          parsedMembers = typeof teamMembersRaw === 'string' ? JSON.parse(teamMembersRaw) : teamMembersRaw;
        } catch {
          parsedMembers = [];
        }
      }

      // Total team size includes Leader (1) + Members (parsedMembers.length)
      const totalTeamSize = 1 + parsedMembers.length;
      if (totalTeamSize < event.min_team_size || totalTeamSize > event.max_team_size) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({
          error: `Invalid team size. ${event.name} requires ${
            event.min_team_size === event.max_team_size
              ? event.min_team_size
              : `${event.min_team_size} to ${event.max_team_size}`
          } members (including team leader). Current: ${totalTeamSize}.`
        });
      }
    }

    // 9. Generate Sequential Unique Registration ID: MVX-2026-000001
    db.registration_counter += 1;
    const seqNum = String(db.registration_counter).padStart(6, '0');
    const registrationId = `MVX-2026-${seqNum}`;

    // 10. Record Registration
    const newRegistration = {
      id: crypto.randomUUID(),
      registration_id: registrationId,
      event_id: event.id,
      event_name: event.name,
      registration_type: event.registration_type,
      team_name: event.registration_type === 'team' ? team_name.trim() : null,
      leader_name: leader_name.trim(),
      leader_email: leader_email.trim().toLowerCase(),
      leader_mobile: cleanMobile,
      college: college.trim(),
      department: department.trim(),
      year: year.trim(),
      division: division ? division.trim() : null,
      amount: Number(event.fee), // Verified server-side dynamic fee
      utr: cleanUTR,
      payment_screenshot_path: req.file.filename,
      payment_status: 'Pending Verification',
      rejection_reason: null,
      submitted_at: new Date().toISOString(),
      verified_at: null,
      verified_by: null,
      team_members: parsedMembers,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    db.registrations.unshift(newRegistration);
    saveDB(db);

    // Broadcast realtime event
    broadcastRealtime('registration_created', {
      registration_id: registrationId,
      event_name: event.name,
      leader_name: newRegistration.leader_name,
      amount: newRegistration.amount
    });

    return res.status(201).json({
      success: true,
      message: 'Registration submitted successfully.',
      registration: {
        id: newRegistration.id,
        registration_id: newRegistration.registration_id,
        event_name: newRegistration.event_name,
        leader_name: newRegistration.leader_name,
        team_name: newRegistration.team_name,
        amount: newRegistration.amount,
        payment_status: newRegistration.payment_status,
        submitted_at: newRegistration.submitted_at
      }
    });
  } catch (err: any) {
    console.error('Registration processing error:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ error: 'Unable to submit registration. Please try again.' });
  }
});

// PUBLIC API: Get registration details for success / receipt print
// Does NOT expose private screenshot or admin notes
app.get('/api/registrations/:registrationId', (req, res) => {
  const reg = db.registrations.find(
    r => r.registration_id === req.params.registrationId || r.id === req.params.registrationId
  );
  if (!reg) {
    return res.status(404).json({ error: 'Registration receipt not found.' });
  }

  // Return public safe receipt fields
  res.json({
    registration_id: reg.registration_id,
    event_name: reg.event_name,
    registration_type: reg.registration_type,
    team_name: reg.team_name,
    leader_name: reg.leader_name,
    leader_email: reg.leader_email,
    leader_mobile: reg.leader_mobile,
    college: reg.college,
    department: reg.department,
    year: reg.year,
    division: reg.division,
    amount: reg.amount,
    utr: reg.utr,
    payment_status: reg.payment_status,
    submitted_at: reg.submitted_at,
    team_members: reg.team_members || []
  });
});

// Realtime SSE endpoint
app.get('/api/realtime/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = crypto.randomUUID();
  const client = { id: clientId, res };
  realtimeClients.push(client);

  res.write(`data: ${JSON.stringify({ event: 'connected', clientId })}\n\n`);

  req.on('close', () => {
    const idx = realtimeClients.findIndex(c => c.id === clientId);
    if (idx !== -1) realtimeClients.splice(idx, 1);
  });
});

// ADMIN AUTH: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = db.admin_profiles.find(u => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    addAuditLog('Login Failed', 'auth', `Unrecognized email attempt: ${cleanEmail}`, 'Anonymous', cleanEmail, clientIp);
    return res.status(401).json({ error: 'Invalid admin credentials.' });
  }

  const incomingHash = hashPassword(password);
  if (user.password_hash !== incomingHash) {
    addAuditLog('Login Failed', 'auth', `Incorrect password attempt for admin: ${cleanEmail}`, user.name, cleanEmail, clientIp);
    return res.status(401).json({ error: 'Invalid admin credentials.' });
  }

  // Check Super Admin approval status
  const isSuperAdmin = user.role === 'super_admin' || cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase();

  if (!isSuperAdmin) {
    if (user.approval_status === 'pending') {
      addAuditLog('Login Blocked', 'auth', `Pending approval login attempt by: ${cleanEmail}`, user.name, user.email, clientIp);
      return res.status(403).json({
        error: 'Your admin account is pending approval by Super Admin (Prof. Hitesh Badgujar). Please contact hiteshbadgujar.mech@sitrc.org to approve your access.',
        pending_approval: true
      });
    }

    if (user.approval_status === 'rejected') {
      addAuditLog('Login Blocked', 'auth', `Rejected/Revoked admin login attempt by: ${cleanEmail}`, user.name, user.email, clientIp);
      return res.status(403).json({
        error: 'Your admin access has been revoked or rejected by the Super Admin.',
        rejected: true
      });
    }
  }

  const token = generateToken(user);
  addAuditLog(
    isSuperAdmin ? 'Super Admin Logged In' : 'Admin Logged In',
    'auth',
    `Administrator session established (${isSuperAdmin ? 'SUPER ADMIN' : user.role})`,
    user.name,
    user.email,
    clientIp
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      approval_status: user.approval_status || 'approved'
    }
  });
});

// ADMIN AUTH: Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const session = activeSessions.get(token);
    if (session) {
      addAuditLog('Admin Logged Out', 'auth', `Session ended for ${session.email}`, session.name, session.email);
      activeSessions.delete(token);
    }
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ADMIN AUDIT LOGS: Get recent admin activity trail
app.get('/api/admin/logs', requireAdmin, (_req, res) => {
  res.json({
    total: db.audit_logs?.length || 0,
    logs: db.audit_logs || []
  });
});

// ADMIN REQUEST: Request new Admin Account (Must be approved by Super Admin)
app.post('/api/auth/request-access', (req, res) => {
  const { name, email, password, department, role } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const existing = db.admin_profiles.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(400).json({ error: 'An admin account with this email already exists.' });
  }

  const newAdmin = {
    id: crypto.randomUUID(),
    email: cleanEmail,
    password_hash: hashPassword(password),
    name: name.trim(),
    department: department ? department.trim() : 'Mechanical Engineering',
    role: role === 'coordinator' ? 'coordinator' : 'admin',
    approval_status: 'pending',
    approved_by: null,
    approved_at: null,
    created_at: new Date().toISOString()
  };

  db.admin_profiles.push(newAdmin);
  saveDB(db);

  addAuditLog(
    'Admin Access Requested',
    'auth',
    `New admin request submitted by ${newAdmin.name} (${cleanEmail}). Status: Pending Super Admin Approval`,
    newAdmin.name,
    cleanEmail
  );
  broadcastRealtime('admin_request_submitted', { name: newAdmin.name, email: cleanEmail });

  res.status(201).json({
    success: true,
    message: 'Admin access request submitted successfully. Super Admin (Prof. Hitesh Badgujar) must approve your account before you can log in.',
    pending_approval: true
  });
});

// SUPER ADMIN ONLY: Get all admin profiles & pending approvals
app.get('/api/admin/users', requireAdmin, (req, res) => {
  const currentAdmin = (req as any).adminUser;
  const isSuper = currentAdmin.role === 'super_admin' || currentAdmin.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  const safeUsers = db.admin_profiles.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department || 'Mechanical Engineering',
    approval_status: u.approval_status || (u.role === 'super_admin' ? 'approved' : 'approved'),
    approved_by: u.approved_by,
    approved_at: u.approved_at,
    created_at: u.created_at
  }));

  const pendingCount = safeUsers.filter(u => u.approval_status === 'pending').length;

  res.json({
    isSuperAdmin: isSuper,
    pendingCount,
    users: safeUsers
  });
});

// SUPER ADMIN ONLY: Approve Admin Access
app.post('/api/admin/users/:id/approve', requireSuperAdmin, (req, res) => {
  const superAdmin = (req as any).adminUser;
  const targetUser = db.admin_profiles.find(u => u.id === req.params.id);

  if (!targetUser) {
    return res.status(404).json({ error: 'Admin profile not found.' });
  }

  targetUser.approval_status = 'approved';
  targetUser.approved_by = superAdmin.name;
  targetUser.approved_at = new Date().toISOString();

  saveDB(db);

  addAuditLog(
    'Admin Approved by Super Admin',
    'auth',
    `Super Admin approved account access for ${targetUser.name} (${targetUser.email})`,
    superAdmin.name,
    superAdmin.email
  );
  broadcastRealtime('admin_status_updated', { id: targetUser.id, status: 'approved' });

  res.json({
    success: true,
    message: `Admin access for ${targetUser.name} has been approved! They can now log in.`,
    user: {
      id: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      approval_status: targetUser.approval_status
    }
  });
});

// SUPER ADMIN ONLY: Reject / Revoke Admin Access
app.post('/api/admin/users/:id/reject', requireSuperAdmin, (req, res) => {
  const superAdmin = (req as any).adminUser;
  const targetUser = db.admin_profiles.find(u => u.id === req.params.id);

  if (!targetUser) {
    return res.status(404).json({ error: 'Admin profile not found.' });
  }

  if (targetUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return res.status(400).json({ error: 'Cannot reject or revoke Super Admin account.' });
  }

  targetUser.approval_status = 'rejected';
  saveDB(db);

  // Invalidate any active session token for this user
  for (const [token, sess] of activeSessions.entries()) {
    if (sess.email.toLowerCase() === targetUser.email.toLowerCase()) {
      activeSessions.delete(token);
    }
  }

  addAuditLog(
    'Admin Access Revoked',
    'auth',
    `Super Admin revoked access for ${targetUser.name} (${targetUser.email})`,
    superAdmin.name,
    superAdmin.email
  );
  broadcastRealtime('admin_status_updated', { id: targetUser.id, status: 'rejected' });

  res.json({
    success: true,
    message: `Admin access for ${targetUser.name} has been revoked.`,
    user: {
      id: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      approval_status: targetUser.approval_status
    }
  });
});

// SUPER ADMIN ONLY: Delete Admin Profile
app.delete('/api/admin/users/:id', requireSuperAdmin, (req, res) => {
  const superAdmin = (req as any).adminUser;
  const targetUser = db.admin_profiles.find(u => u.id === req.params.id);

  if (!targetUser) {
    return res.status(404).json({ error: 'Admin profile not found.' });
  }

  if (targetUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return res.status(400).json({ error: 'Cannot delete Super Admin master account.' });
  }

  db.admin_profiles = db.admin_profiles.filter(u => u.id !== req.params.id);
  saveDB(db);

  // Invalidate any active session
  for (const [token, sess] of activeSessions.entries()) {
    if (sess.email.toLowerCase() === targetUser.email.toLowerCase()) {
      activeSessions.delete(token);
    }
  }

  addAuditLog(
    'Admin Profile Deleted',
    'auth',
    `Super Admin permanently deleted profile for ${targetUser.name} (${targetUser.email})`,
    superAdmin.name,
    superAdmin.email
  );

  res.json({ success: true, message: 'Admin profile deleted successfully.' });
});


// ADMIN AUTH: Verify current session
app.get('/api/auth/me', requireAdmin, (req, res) => {
  res.json({ user: (req as any).adminUser });
});

// ADMIN: Dashboard Statistics
app.get('/api/admin/dashboard', requireAdmin, (_req, res) => {
  const regs = db.registrations;
  const totalRegistrations = regs.length;
  const verifiedRegistrations = regs.filter(r => r.payment_status === 'Verified').length;
  const pendingRegistrations = regs.filter(r => r.payment_status === 'Pending Verification').length;
  const rejectedRegistrations = regs.filter(r => r.payment_status === 'Rejected').length;

  const totalCollection = regs
    .filter(r => r.payment_status === 'Verified')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRegistrations = regs.filter(r => r.submitted_at?.startsWith(todayStr)).length;

  // Event-wise count & collection
  const eventMap = new Map<string, { eventName: string; count: number; amount: number }>();
  db.events.forEach(e => {
    eventMap.set(e.id, { eventName: e.name, count: 0, amount: 0 });
  });

  regs.forEach(r => {
    const existing = eventMap.get(r.event_id) || { eventName: r.event_name, count: 0, amount: 0 };
    existing.count += 1;
    if (r.payment_status === 'Verified') {
      existing.amount += Number(r.amount) || 0;
    }
    eventMap.set(r.event_id, existing);
  });

  const eventBreakdown = Array.from(eventMap.values());

  const statusDistribution = [
    { status: 'Pending Verification', count: pendingRegistrations },
    { status: 'Verified', count: verifiedRegistrations },
    { status: 'Rejected', count: rejectedRegistrations }
  ];

  res.json({
    totalRegistrations,
    verifiedRegistrations,
    pendingRegistrations,
    rejectedRegistrations,
    totalCollection,
    todayRegistrations,
    recentRegistrations: regs.slice(0, 10),
    eventBreakdown,
    statusDistribution
  });
});

// ADMIN: Get Registrations with search, filter, pagination
app.get('/api/admin/registrations', requireAdmin, (req, res) => {
  let list = [...db.registrations];
  const { event_id, status, search, date } = req.query;

  if (event_id && event_id !== 'all') {
    list = list.filter(r => r.event_id === event_id || r.event_name === event_id);
  }

  if (status && status !== 'all') {
    list = list.filter(r => r.payment_status === status);
  }

  if (date) {
    list = list.filter(r => r.submitted_at?.startsWith(String(date)));
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(r =>
      r.registration_id.toLowerCase().includes(q) ||
      r.leader_name.toLowerCase().includes(q) ||
      r.leader_email.toLowerCase().includes(q) ||
      r.leader_mobile.toLowerCase().includes(q) ||
      r.college.toLowerCase().includes(q) ||
      r.utr.toLowerCase().includes(q) ||
      (r.team_name && r.team_name.toLowerCase().includes(q))
    );
  }

  res.json({
    total: list.length,
    registrations: list
  });
});

// ADMIN: Get Registration Detail
app.get('/api/admin/registrations/:id', requireAdmin, (req, res) => {
  const reg = db.registrations.find(r => r.id === req.params.id || r.registration_id === req.params.id);
  if (!reg) return res.status(404).json({ error: 'Registration not found.' });
  res.json(reg);
});

// ADMIN: Verify Payment
app.post('/api/admin/registrations/:id/verify', requireAdmin, (req, res) => {
  const reg = db.registrations.find(r => r.id === req.params.id || r.registration_id === req.params.id);
  if (!reg) return res.status(404).json({ error: 'Registration not found.' });

  const adminName = (req as any).adminUser?.name || 'Administrator';
  const adminEmail = (req as any).adminUser?.email || 'admin@sitrc.ac.in';
  reg.payment_status = 'Verified';
  reg.verified_at = new Date().toISOString();
  reg.verified_by = adminName;
  reg.rejection_reason = null;
  reg.updated_at = new Date().toISOString();

  saveDB(db);
  addAuditLog(
    'Payment Verified',
    'verification',
    `Verified payment of ₹${reg.amount} for ${reg.registration_id} (${reg.leader_name}, UTR: ${reg.utr})`,
    adminName,
    adminEmail
  );
  broadcastRealtime('payment_verified', { registration_id: reg.registration_id, status: 'Verified' });

  res.json({ success: true, message: 'Payment verified successfully.', registration: reg });
});

// ADMIN: Reject Payment
app.post('/api/admin/registrations/:id/reject', requireAdmin, (req, res) => {
  const reg = db.registrations.find(r => r.id === req.params.id || r.registration_id === req.params.id);
  if (!reg) return res.status(404).json({ error: 'Registration not found.' });

  const { reason } = req.body;
  const adminName = (req as any).adminUser?.name || 'Administrator';
  const adminEmail = (req as any).adminUser?.email || 'admin@sitrc.ac.in';

  reg.payment_status = 'Rejected';
  reg.verified_at = new Date().toISOString();
  reg.verified_by = adminName;
  reg.rejection_reason = reason ? reason.trim() : 'Invalid or unverified transaction UTR / payment receipt';
  reg.updated_at = new Date().toISOString();

  saveDB(db);
  addAuditLog(
    'Payment Rejected',
    'verification',
    `Rejected payment for ${reg.registration_id} (${reg.leader_name}). Reason: ${reg.rejection_reason}`,
    adminName,
    adminEmail
  );
  broadcastRealtime('payment_rejected', { registration_id: reg.registration_id, status: 'Rejected' });

  res.json({ success: true, message: 'Payment marked as rejected.', registration: reg });
});

// SUPER ADMIN ONLY: Delete Registration and Records
app.delete('/api/admin/registrations/:id', requireSuperAdmin, (req, res) => {
  const superAdmin = (req as any).adminUser;
  const regIndex = db.registrations.findIndex(
    r => r.id === req.params.id || r.registration_id === req.params.id
  );

  if (regIndex === -1) {
    return res.status(404).json({ error: 'Registration record not found.' });
  }

  const reg = db.registrations[regIndex];

  // Clean up payment screenshot file if it exists
  if (reg.payment_screenshot_path) {
    const proofFile = path.join(PROOFS_DIR, path.basename(reg.payment_screenshot_path));
    if (fs.existsSync(proofFile)) {
      try {
        fs.unlinkSync(proofFile);
      } catch (err) {
        console.error('Failed to unlink payment screenshot:', err);
      }
    }
  }

  // Remove registration from db
  db.registrations.splice(regIndex, 1);
  saveDB(db);

  addAuditLog(
    'Registration Deleted',
    'verification',
    `Super Admin permanently deleted registration ${reg.registration_id} (${reg.leader_name}, Event: ${reg.event_name})`,
    superAdmin.name,
    superAdmin.email
  );

  broadcastRealtime('registration_deleted', {
    registration_id: reg.registration_id,
    id: reg.id
  });

  res.json({
    success: true,
    message: `Registration ${reg.registration_id} and all its records have been permanently deleted.`
  });
});


// ADMIN: Secure Private Payment Proof Access
// Never exposes proof publicly; only authenticated admins can view
app.get('/api/admin/payment-proof/:filename', requireAdmin, (req, res) => {
  const safeFilename = path.basename(req.params.filename);
  const filePath = path.join(PROOFS_DIR, safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Payment screenshot not found.' });
  }

  res.sendFile(filePath);
});

// ADMIN: Update Event (dynamic fees, status, rules, coordinators, team sizes)
app.put('/api/admin/events/:id', requireAdmin, (req, res) => {
  const event = db.events.find(e => e.id === req.params.id || e.slug === req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found.' });

  const {
    name,
    category,
    description,
    rules,
    fee,
    registration_type,
    min_team_size,
    max_team_size,
    coordinator_name,
    coordinator_phone,
    registration_open,
    event_date
  } = req.body;

  if (name !== undefined) event.name = name.trim();
  if (category !== undefined) event.category = category.trim();
  if (description !== undefined) event.description = description.trim();
  if (rules !== undefined) event.rules = rules.trim();
  if (fee !== undefined) {
    const numFee = Number(fee);
    if (isNaN(numFee) || numFee < 0) {
      return res.status(400).json({ error: 'Fee must be a valid non-negative number.' });
    }
    event.fee = numFee;
  }
  if (registration_type !== undefined) event.registration_type = registration_type;
  if (min_team_size !== undefined) event.min_team_size = Number(min_team_size);
  if (max_team_size !== undefined) event.max_team_size = Number(max_team_size);
  if (coordinator_name !== undefined) event.coordinator_name = coordinator_name.trim();
  if (coordinator_phone !== undefined) event.coordinator_phone = coordinator_phone.trim();
  if (registration_open !== undefined) event.registration_open = Boolean(registration_open);
  if (event_date !== undefined) event.event_date = event_date.trim();

  event.updated_at = new Date().toISOString();
  saveDB(db);

  broadcastRealtime('event_updated', { event_id: event.id, name: event.name, fee: event.fee });

  res.json({ success: true, message: 'Event updated successfully.', event });
});

// ADMIN: Add New Event
app.post('/api/admin/events', requireAdmin, (req, res) => {
  const {
    name,
    slug,
    category,
    description,
    rules,
    fee,
    registration_type,
    min_team_size,
    max_team_size,
    coordinator_name,
    coordinator_phone,
    registration_open,
    event_date
  } = req.body;

  if (!name || !slug || fee === undefined) {
    return res.status(400).json({ error: 'Name, slug, and fee are required.' });
  }

  const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
  if (db.events.find(e => e.slug === cleanSlug)) {
    return res.status(400).json({ error: 'An event with this slug already exists.' });
  }

  const newEvent = {
    id: crypto.randomUUID(),
    slug: cleanSlug,
    name: name.trim(),
    category: category || 'Engineering',
    description: description || '',
    rules: rules || '',
    fee: Number(fee),
    registration_type: registration_type || 'individual',
    min_team_size: Number(min_team_size) || 1,
    max_team_size: Number(max_team_size) || 1,
    coordinator_name: coordinator_name || 'Coordinator',
    coordinator_phone: coordinator_phone || '',
    registration_open: registration_open !== undefined ? Boolean(registration_open) : true,
    event_date: event_date || '13th & 14th September 2026',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  db.events.push(newEvent);
  saveDB(db);

  res.status(201).json({ success: true, message: 'Event created successfully.', event: newEvent });
});

// ADMIN: Update Site Settings (dates, venue, contact)
app.put('/api/admin/settings', requireAdmin, (req, res) => {
  const {
    event_name,
    event_tagline,
    event_description,
    start_date,
    end_date,
    venue,
    contact_email,
    contact_phone
  } = req.body;

  if (event_name) db.site_settings.event_name = event_name.trim();
  if (event_tagline) db.site_settings.event_tagline = event_tagline.trim();
  if (event_description) db.site_settings.event_description = event_description.trim();
  if (start_date) db.site_settings.start_date = start_date.trim();
  if (end_date) db.site_settings.end_date = end_date.trim();
  if (venue) db.site_settings.venue = venue.trim();
  if (contact_email) db.site_settings.contact_email = contact_email.trim();
  if (contact_phone) db.site_settings.contact_phone = contact_phone.trim();

  db.site_settings.updated_at = new Date().toISOString();
  saveDB(db);

  broadcastRealtime('settings_updated', db.site_settings);

  res.json({ success: true, message: 'Site settings updated successfully.', settings: db.site_settings });
});

// ADMIN: Update Payment Settings (UPI ID, Instructions, QR Code image upload)
app.put('/api/admin/settings/payment', requireAdmin, uploadQr.single('qr_code_image'), (req: Request, res: Response) => {
  const { upi_id, payment_instructions, contact_phone, qr_code_path } = req.body;

  if (upi_id !== undefined) db.site_settings.upi_id = upi_id.trim();
  if (payment_instructions !== undefined) db.site_settings.payment_instructions = payment_instructions.trim();
  if (contact_phone !== undefined) db.site_settings.contact_phone = contact_phone.trim();

  // If a new QR code file is uploaded
  if (req.file) {
    db.site_settings.qr_code_path = `/uploads/qr-codes/${req.file.filename}`;
  } else if (qr_code_path !== undefined) {
    db.site_settings.qr_code_path = qr_code_path.trim();
  }

  db.site_settings.updated_at = new Date().toISOString();
  saveDB(db);

  broadcastRealtime('settings_updated', db.site_settings);

  res.json({ success: true, message: 'Payment settings updated successfully.', settings: db.site_settings });
});

// ADMIN: CSV Export
app.get('/api/admin/export/csv', requireAdmin, (req, res) => {
  let list = [...db.registrations];
  const { event_id, status } = req.query;

  if (event_id && event_id !== 'all') {
    list = list.filter(r => r.event_id === event_id || r.event_name === event_id);
  }
  if (status && status !== 'all') {
    list = list.filter(r => r.payment_status === status);
  }

  const escapeCsv = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headers = [
    'Registration ID',
    'Registration Date',
    'Event',
    'Category',
    'Participant/Team Name',
    'Team Members',
    'Email',
    'Mobile',
    'College',
    'Department',
    'Year',
    'Amount',
    'UTR',
    'Payment Status',
    'Rejection Reason',
    'Verified Date',
    'Verified By'
  ];

  const rows = list.map(r => {
    const event = db.events.find(e => e.id === r.event_id) || { category: 'Engineering' };
    const membersList = (r.team_members || []).map((m: any) => `${m.name} (${m.mobile || 'N/A'})`).join('; ');
    const displayName = r.registration_type === 'team' ? `${r.team_name} (Leader: ${r.leader_name})` : r.leader_name;

    return [
      escapeCsv(r.registration_id),
      escapeCsv(r.submitted_at),
      escapeCsv(r.event_name),
      escapeCsv(event.category),
      escapeCsv(displayName),
      escapeCsv(membersList || 'None'),
      escapeCsv(r.leader_email),
      escapeCsv(r.leader_mobile),
      escapeCsv(r.college),
      escapeCsv(r.department),
      escapeCsv(r.year),
      escapeCsv(r.amount),
      escapeCsv(r.utr),
      escapeCsv(r.payment_status),
      escapeCsv(r.rejection_reason || ''),
      escapeCsv(r.verified_at || ''),
      escapeCsv(r.verified_by || '')
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=mechvortex_registrations_${Date.now()}.csv`);
  res.send(csvContent);
});

// System Status & Supabase Connection Check
app.get('/api/system/status', (_req, res) => {
  res.json({
    appName: 'MECHVORTEX 2026',
    status: 'online',
    timestamp: new Date().toISOString(),
    database: {
      type: supabase ? 'supabase_connected' : 'active_integrated_db',
      supabase_configured: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
      supabase_url: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 18)}...` : 'Not configured'
    },
    counts: {
      events: db.events.length,
      registrations: db.registrations.length,
      admins: db.admin_profiles.length
    }
  });
});

// Vite Middleware for Dev and Static serve for Production
async function setupApp() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MECHVORTEX 2026 Production Server active on http://0.0.0.0:${PORT}`);
  });
}

setupApp().catch(err => {
  console.error('Failed to start MECHVORTEX server:', err);
});
