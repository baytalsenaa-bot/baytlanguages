type IconProps = { className?: string };

const base = "h-6 w-6";

export function ShieldCheckIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" strokeLinejoin="round" />
      <path d="M9 12.5l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UsersIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
      <path d="M16 4.5a3 3 0 0 1 0 6" strokeLinecap="round" />
      <path d="M15 14c2.8.3 5 2.8 5 6" strokeLinecap="round" />
    </svg>
  );
}

export function QrCodeIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <rect x="3" y="3" width="6" height="6" rx="0.5" />
      <rect x="15" y="3" width="6" height="6" rx="0.5" />
      <rect x="3" y="15" width="6" height="6" rx="0.5" />
      <path d="M15 15h2.5v2.5H15zM19.5 15H21v1.5M15 19.5h1.5V21M19.5 19.5H21V21" strokeLinecap="round" />
    </svg>
  );
}

export function LockIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <rect x="5" y="10.5" width="14" height="10" rx="1.5" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" strokeLinecap="round" />
    </svg>
  );
}

export function ScaleIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M12 3v18M7 21h10" strokeLinecap="round" />
      <path d="M4 7h6M14 7h6" strokeLinecap="round" />
      <path d="M4 7l-2 5a3 3 0 0 0 6 0L6 7M20 7l-2 5a3 3 0 0 0 6 0l-2-5" strokeLinejoin="round" />
    </svg>
  );
}

export function StethoscopeIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M6 3v6a4 4 0 0 0 8 0V3" strokeLinecap="round" />
      <path d="M10 13v2a6 6 0 0 0 12 0v-1" strokeLinecap="round" />
      <circle cx="21" cy="12.5" r="1.4" />
      <circle cx="6" cy="4" r="1" />
      <circle cx="10" cy="4" r="1" />
    </svg>
  );
}

export function GraduationCapIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M2 8l10-4 10 4-10 4-10-4Z" strokeLinejoin="round" />
      <path d="M6 10.5v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4" strokeLinecap="round" />
      <path d="M22 8v6" strokeLinecap="round" />
    </svg>
  );
}

export function BriefcaseIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <rect x="3" y="7.5" width="18" height="12" rx="1.5" />
      <path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" strokeLinecap="round" />
      <path d="M3 12.5h18" />
    </svg>
  );
}

export function IdCardIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <circle cx="8.5" cy="11" r="2" />
      <path d="M5.5 16c.5-1.8 1.8-2.6 3-2.6s2.5.8 3 2.6" strokeLinecap="round" />
      <path d="M14 10h6M14 13h6" strokeLinecap="round" />
    </svg>
  );
}

export function StampIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <circle cx="12" cy="8" r="5" />
      <path d="M9.5 8l1.7 1.7L14.5 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 15h8l1.5 5h-11L8 15Z" strokeLinejoin="round" />
    </svg>
  );
}

export function GovBuildingIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M3 9l9-5 9 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9v10M9 9v10M15 9v10M19 9v10" strokeLinecap="round" />
      <path d="M3 19h18" strokeLinecap="round" />
    </svg>
  );
}

export function ConstructionIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M4 21V9l6-4 6 4v12" strokeLinejoin="round" />
      <path d="M14 21V13l6-3v11" strokeLinejoin="round" />
      <path d="M4 21h16" strokeLinecap="round" />
      <path d="M8 13h2M8 17h2" strokeLinecap="round" />
    </svg>
  );
}

export function BoltIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function SignalIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M3 11a13 13 0 0 1 18 0" strokeLinecap="round" />
      <path d="M6.5 14.5a8 8 0 0 1 11 0" strokeLinecap="round" />
      <path d="M10 18a3.5 3.5 0 0 1 4 0" strokeLinecap="round" />
      <circle cx="12" cy="20.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BanIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M6.5 6.5l11 11" strokeLinecap="round" />
    </svg>
  );
}

export function ClockIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchXIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 21 21" strokeLinecap="round" />
      <path d="M8.5 8.5l4 4M12.5 8.5l-4 4" strokeLinecap="round" />
    </svg>
  );
}

export function FactoryIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M3 21V11l5 3v-3l5 3v-3l5 3v7Z" strokeLinejoin="round" />
      <path d="M3 21h18" strokeLinecap="round" />
      <path d="M7 17v2M11 17v2M15 17v2" strokeLinecap="round" />
    </svg>
  );
}
