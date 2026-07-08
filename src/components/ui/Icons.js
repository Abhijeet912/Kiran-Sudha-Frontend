/** Inline SVG icons (stroke = currentColor) — no icon library needed. */

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export function SearchIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...base} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function MapPinIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...base} className={className}>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function CartIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...base} className={className}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57L23 6H6" />
    </svg>
  );
}

export function UserIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...base} className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function HeartIcon({ className = "h-5 w-5", filled = false }) {
  return (
    <svg {...base} fill={filled ? "currentColor" : "none"} className={className}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export function MenuIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...base} className={className}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

export function XIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...base} className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function ChevronDownIcon({ className = "h-4 w-4" }) {
  return (
    <svg {...base} className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function StarIcon({ className = "h-4 w-4", filled = true }) {
  return (
    <svg {...base} fill={filled ? "currentColor" : "none"} className={className}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
    </svg>
  );
}

export function BellIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...base} className={className}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

export function PackageIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...base} className={className}>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

/* ---------- Social brand icons (filled) ---------- */

const brand = { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true };

export function FacebookIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...brand} className={className}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...brand} className={className}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58ZM9.75 15.02V8.98L15.5 12Z" />
    </svg>
  );
}

export function PinterestIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...brand} className={className}>
      <path d="M12 2a10 10 0 0 0-3.64 19.31c-.09-.79-.17-2 .03-2.86l1.29-5.48s-.33-.66-.33-1.63c0-1.53.89-2.67 1.99-2.67.94 0 1.39.7 1.39 1.55 0 .94-.6 2.35-.91 3.66-.26 1.09.55 1.98 1.63 1.98 1.96 0 3.46-2.06 3.46-5.04 0-2.63-1.89-4.48-4.6-4.48a4.76 4.76 0 0 0-4.97 4.77c0 .95.36 1.96.82 2.51a.33.33 0 0 1 .08.32l-.31 1.24c-.05.2-.16.25-.37.15-1.37-.64-2.23-2.63-2.23-4.24 0-3.45 2.51-6.62 7.23-6.62 3.8 0 6.75 2.7 6.75 6.32 0 3.77-2.38 6.81-5.68 6.81-1.11 0-2.15-.58-2.51-1.26l-.68 2.6c-.25.95-.92 2.15-1.37 2.88A10 10 0 1 0 12 2Z" />
    </svg>
  );
}
