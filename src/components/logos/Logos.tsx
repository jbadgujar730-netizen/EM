import React from 'react';

// 1. Sandip Foundation Logo (Lion emblem + Serif typography)
export const SandipFoundationLogo: React.FC<{ className?: string }> = ({ className = 'h-12 w-auto' }) => (
  <svg
    viewBox="0 0 240 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Sandip Foundation Logo"
  >
    {/* Outer Sunburst Ring */}
    <g transform="translate(120, 70)">
      {/* Sun rays - 24 radial rays */}
      <circle cx="0" cy="0" r="54" fill="#111827" />
      <circle cx="0" cy="0" r="50" fill="#ffffff" />
      
      {/* Triangular sunburst rays */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        return (
          <polygon
            key={i}
            points="0,-49 6,-32 -6,-32"
            fill="#111827"
            transform={`rotate(${angle})`}
          />
        );
      })}

      {/* Inner circular frame for lion */}
      <circle cx="0" cy="0" r="32" fill="#111827" stroke="#ffffff" strokeWidth="2.5" />
      
      {/* Lion Head Heraldic Silhouette */}
      <g fill="#ffffff">
        {/* Forehead & Mane Crown */}
        <path d="M-10,-20 L0,-26 L10,-20 L15,-12 L10,-6 L-10,-6 L-15,-12 Z" />
        {/* Temples and Cheeks */}
        <path d="M-18,-10 L-22,0 L-18,10 L-10,18 L-8,12 L-12,2 L-12,-8 Z" />
        <path d="M18,-10 L22,0 L18,10 L10,18 L8,12 L12,2 L12,-8 Z" />
        {/* Face center / nose bridge */}
        <path d="M-7,-6 L7,-6 L5,8 L0,12 L-5,8 Z" />
        {/* Muzzle and Chin */}
        <circle cx="-5" cy="11" r="3" />
        <circle cx="5" cy="11" r="3" />
        <polygon points="0,10 -4,15 4,15" />
        <polygon points="-3,16 3,16 0,21" />
        {/* Piercing eyes */}
        <polygon points="-7,-1 -2,-1 -4,-4" fill="#111827" />
        <polygon points="7,-1 2,-1 4,-4" fill="#111827" />
      </g>
    </g>

    {/* Text: SANDIP */}
    <text
      x="120"
      y="152"
      textAnchor="middle"
      fontFamily="Georgia, 'Times New Roman', serif"
      fontWeight="700"
      fontSize="27"
      letterSpacing="2"
      fill="#C1121F"
    >
      SANDIP
    </text>

    {/* Red accent separator bar */}
    <line x1="38" y1="160" x2="202" y2="160" stroke="#C1121F" strokeWidth="1.8" />

    {/* Text: FOUNDATION */}
    <text
      x="120"
      y="182"
      textAnchor="middle"
      fontFamily="Georgia, 'Times New Roman', serif"
      fontWeight="700"
      fontSize="17"
      letterSpacing="5"
      fill="#1E293B"
    >
      FOUNDATION
    </text>
  </svg>
);

// 2. Sandip Foundation's SITRC Wordmark
export const SitrcLogo: React.FC<{ className?: string }> = ({ className = 'h-12 w-auto' }) => (
  <svg
    viewBox="0 0 240 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Sandip Foundation's SITRC Logo"
  >
    {/* Subtitle: SANDIP FOUNDATION'S */}
    <text
      x="12"
      y="34"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontWeight="800"
      fontSize="15"
      letterSpacing="1"
      fill="#475569"
    >
      SANDIP FOUNDATION&apos;S
    </text>

    {/* Main Headline: SITRC in solid vibrant university gold-orange */}
    <text
      x="10"
      y="106"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontWeight="900"
      fontSize="76"
      letterSpacing="-2"
      fill="#EA580C"
    >
      SITRC
    </text>
  </svg>
);

// 3. The Institution of Engineers (India) [IEI] Emblem
export const IeiLogo: React.FC<{ className?: string }> = ({ className = 'h-12 w-auto' }) => (
  <svg
    viewBox="0 0 220 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="The Institution of Engineers (India) Emblem"
  >
    {/* Outer Red Ring */}
    <circle cx="110" cy="110" r="104" stroke="#DC2626" strokeWidth="4.5" fill="#FFFDF8" />
    
    {/* Outer Dotted / Rope Border */}
    <circle cx="110" cy="110" r="97" stroke="#1E3A8A" strokeWidth="2.5" strokeDasharray="3 3" />

    {/* Royal Navy Blue Circular Banner */}
    <circle cx="110" cy="110" r="88" stroke="#1E3A8A" strokeWidth="18" fill="none" />

    {/* Text Arc: Top - THE INSTITUTION OF ENGINEERS (INDIA) */}
    <path id="ieiTopPath" d="M 28,110 A 82,82 0 0,1 192,110" fill="none" />
    <text fontSize="10" fontWeight="800" fill="#FFFFFF" letterSpacing="0.8" fontFamily="system-ui, sans-serif">
      <textPath href="#ieiTopPath" startOffset="50%" textAnchor="middle">
        THE INSTITUTION OF ENGINEERS (INDIA)
      </textPath>
    </text>

    {/* Stars on flanks */}
    <path
      d="M 24,110 L 26,106 L 30,106 L 27,109 L 28,113 L 24,111 L 20,113 L 21,109 L 18,106 L 22,106 Z"
      fill="#EF4444"
    />
    <path
      d="M 196,110 L 198,106 L 202,106 L 199,109 L 200,113 L 196,111 L 192,113 L 193,109 L 190,106 L 194,106 Z"
      fill="#EF4444"
    />

    {/* Text Arc: Bottom - ESTD 1920 • ROYAL CHARTER 1935 */}
    <path id="ieiBottomPath" d="M 190,118 A 82,82 0 0,1 30,118" fill="none" />
    <text fontSize="8.5" fontWeight="800" fill="#FFFFFF" letterSpacing="0.6" fontFamily="system-ui, sans-serif">
      <textPath href="#ieiBottomPath" startOffset="50%" textAnchor="middle">
        ESTD 1920 • ROYAL CHARTER 1935
      </textPath>
    </text>

    {/* Inner Vignette Circle */}
    <circle cx="110" cy="110" r="74" fill="#EFF6FF" stroke="#DC2626" strokeWidth="2.5" />

    {/* Sky & Industrial Backdrop */}
    <rect x="42" y="76" width="136" height="38" fill="#BAE6FD" opacity="0.6" />
    {/* Ocean horizon */}
    <path d="M 42,95 Q 80,93 110,95 T 178,95 L 178,114 L 42,114 Z" fill="#93C5FD" />
    
    {/* Steamship on water */}
    <g transform="translate(62, 85) scale(0.65)">
      <path d="M 0,10 L 30,10 L 36,4 L 4,4 Z" fill="#1E293B" />
      <rect x="10" y="-1" width="12" height="6" fill="#64748B" />
      <rect x="18" y="-7" width="3" height="6" fill="#DC2626" />
    </g>

    {/* Factory Silhouette on right */}
    <g transform="translate(136, 78) scale(0.6)">
      <polygon points="0,28 10,18 20,28" fill="#475569" />
      <rect x="22" y="8" width="5" height="20" fill="#334155" />
      <path d="M24,4 Q28,2 26,0" stroke="#94A3B8" strokeWidth="2" fill="none" />
    </g>

    {/* Large Cogwheel / Gear in foreground */}
    <g transform="translate(80, 134) scale(0.65)">
      <circle cx="0" cy="0" r="32" fill="#CA8A04" stroke="#854D0E" strokeWidth="3" />
      <circle cx="0" cy="0" r="14" fill="#FFFDF8" stroke="#854D0E" strokeWidth="3" />
      {/* Gear teeth */}
      {Array.from({ length: 12 }).map((_, i) => (
        <rect
          key={i}
          x="-5"
          y="-37"
          width="10"
          height="8"
          fill="#CA8A04"
          stroke="#854D0E"
          strokeWidth="1.5"
          transform={`rotate(${(i * 360) / 12})`}
        />
      ))}
    </g>

    {/* Seated Engineer Figure working with drafting compass */}
    <g transform="translate(108, 126) scale(0.85)">
      {/* Head */}
      <circle cx="0" cy="-38" r="7" fill="#FDBA74" stroke="#7C2D12" strokeWidth="1.5" />
      <path d="M-6,-45 Q0,-49 6,-45" stroke="#1E293B" strokeWidth="3" fill="none" />
      {/* Torso & Arm */}
      <path d="M-6,-30 L6,-30 L10,-8 L-8,-8 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
      {/* Legs & Dungarees */}
      <path d="M-8,-8 L10,-8 L12,18 L3,18 L0,0 L-6,18 L-14,18 Z" fill="#1E3A8A" />
      {/* Arms holding drafting tool */}
      <path d="M-6,-26 L-16,-12 L-10,-4" stroke="#FDBA74" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M6,-26 L16,-12 L8,-2" stroke="#FDBA74" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* Compass / Divider in hand */}
      <line x1="8" y1="-2" x2="3" y2="12" stroke="#DC2626" strokeWidth="2" />
      <line x1="8" y1="-2" x2="13" y2="12" stroke="#DC2626" strokeWidth="2" />
    </g>
  </svg>
);

// 4. MESA SITRC (Mechanical Engineering Students Association) Logo
export const MesaLogo: React.FC<{ className?: string }> = ({ className = 'h-12 w-auto' }) => (
  <svg
    viewBox="0 0 340 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="MESA SITRC Mechanical Engineering Logo"
  >
    {/* Left Mechanical Cog / Gear in C-Shape */}
    <g transform="translate(85, 90)">
      {/* Outer gear body */}
      <circle cx="0" cy="0" r="50" fill="#475569" />
      {/* Center cutout making it a thick ring */}
      <circle cx="0" cy="0" r="30" fill="#FFFFFF" />
      
      {/* 10 Gear teeth protruding around arc */}
      {Array.from({ length: 12 }).map((_, i) => {
        const deg = (i * 360) / 12;
        // Keep teeth mainly on outer left/top/bottom to form the C opening
        return (
          <rect
            key={i}
            x="-7"
            y="-60"
            width="14"
            height="14"
            rx="2"
            fill="#475569"
            transform={`rotate(${deg})`}
          />
        );
      })}

      {/* Opening cut on the right to make it a distinct 'C' gear */}
      <polygon points="12,-42 70,-42 70,42 12,42" fill="#FFFFFF" />
    </g>

    {/* Wordmark: MESA in Charcoal Slate */}
    <text
      x="148"
      y="94"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontWeight="900"
      fontSize="44"
      letterSpacing="-0.5"
      fill="#334155"
    >
      MESA
    </text>

    {/* Wordmark: SITRC in Warm Orange */}
    <text
      x="264"
      y="94"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontWeight="900"
      fontSize="44"
      letterSpacing="-0.5"
      fill="#F97316"
    >
      SITRC
    </text>

    {/* Subline: MECHANICAL ENGINEERING. */}
    <text
      x="150"
      y="126"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontWeight="700"
      fontSize="14"
      letterSpacing="1.5"
      fill="#1E293B"
    >
      MECHANICAL ENGINEERING.
    </text>
  </svg>
);

// Combined Institutional Consortium Bar Component
export const InstitutionalPartnersBar: React.FC<{ variant?: 'light' | 'dark' | 'compact' }> = ({
  variant = 'light'
}) => {
  const isDark = variant === 'dark';

  return (
    <div
      className={`rounded-2xl border transition-all ${
        isDark
          ? 'bg-slate-900/95 border-slate-800 text-white'
          : 'bg-white border-slate-200/90 shadow-sm text-slate-900'
      } p-4 sm:p-6`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
        <span className="text-[11px] font-mono uppercase tracking-widest font-extrabold text-orange-600">
          Official Institutional Consortium & Accreditation
        </span>
        <span className="text-[11px] text-slate-500 font-medium">
          Sandip Institute of Technology & Research Centre (SITRC), Nashik
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-center">
        {/* 1. Sandip Foundation */}
        <div className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
          <div className="h-16 flex items-center justify-center p-1">
            <SandipFoundationLogo className="h-14 w-auto group-hover:scale-105 transition-transform" />
          </div>
          <span className="text-xs font-bold mt-2 text-slate-800 dark:text-slate-200">
            Sandip Foundation
          </span>
          <span className="text-[10px] text-slate-500">Apex Campus Trust</span>
        </div>

        {/* 2. SITRC */}
        <div className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
          <div className="h-16 flex items-center justify-center p-1">
            <SitrcLogo className="h-14 w-auto group-hover:scale-105 transition-transform" />
          </div>
          <span className="text-xs font-bold mt-2 text-slate-800 dark:text-slate-200">
            SITRC Nashik
          </span>
          <span className="text-[10px] text-slate-500">Host Engineering Institute</span>
        </div>

        {/* 3. IEI India */}
        <div className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
          <div className="h-16 flex items-center justify-center p-1">
            <IeiLogo className="h-14 w-auto group-hover:scale-105 transition-transform" />
          </div>
          <span className="text-xs font-bold mt-2 text-slate-800 dark:text-slate-200">
            IEI India
          </span>
          <span className="text-[10px] text-slate-500">Royal Charter Estd. 1920</span>
        </div>

        {/* 4. MESA SITRC */}
        <div className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
          <div className="h-16 flex items-center justify-center p-1">
            <MesaLogo className="h-14 w-auto group-hover:scale-105 transition-transform" />
          </div>
          <span className="text-xs font-bold mt-2 text-slate-800 dark:text-slate-200">
            MESA SITRC
          </span>
          <span className="text-[10px] text-slate-500">Mech. Engg. Students Assoc.</span>
        </div>
      </div>
    </div>
  );
};
