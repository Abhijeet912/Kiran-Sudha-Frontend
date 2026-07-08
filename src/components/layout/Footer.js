import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
  YoutubeIcon,
} from "@/components/ui/Icons";

const SHOP_LINKS = [
  { href: "/products", label: "Shop All" },
  { href: "/offers", label: "Offers" },
  { href: "/vault", label: "Fashion Vault" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/brand-story", label: "Brand Story" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact Us" },
];

const POLICY_LINKS = [
  { href: "/policies/returns", label: "Return & Exchange" },
  { href: "/policies/shipping", label: "Shipping" },
  { href: "/policies/privacy", label: "Privacy Policy" },
  { href: "/policies/terms", label: "Terms & Conditions" },
  { href: "/faqs", label: "FAQs" },
];

const SOCIALS = [
  { href: "https://www.facebook.com", label: "Facebook", Icon: FacebookIcon },
  { href: "https://www.instagram.com", label: "Instagram", Icon: InstagramIcon },
  { href: "https://www.youtube.com", label: "YouTube", Icon: YoutubeIcon },
  { href: "https://www.pinterest.com", label: "Pinterest", Icon: PinterestIcon },
];

function LinkColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-ivory/70 transition-colors hover:text-ivory"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-footer text-ivory print:hidden">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <p className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl text-ivory">Kiran Sudha</span>
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-vermilion"
            />
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-ivory/60">
            Traditional fashion from the states of India — Chikankari,
            Bandhani, Phulkari and more — woven anew with a modern touch.
          </p>
          <ul className="mt-5 flex items-center gap-2">
            {SOCIALS.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ivory/70 ring-1 ring-ivory/15 transition-colors hover:bg-ivory/10 hover:text-ivory"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <LinkColumn title="Shop" links={SHOP_LINKS} />
        <LinkColumn title="Company" links={COMPANY_LINKS} />
        <LinkColumn title="Policies" links={POLICY_LINKS} />
      </div>

      <div className="border-t border-ivory/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-ivory/50 sm:px-6">
          © {new Date().getFullYear()} Kiran Sudha. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
