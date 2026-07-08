"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import { useToast } from "@/context/ToastContext";
import { getTopLevelCategories, getStates } from "@/lib/api/catalog";
import { getUnreadCount } from "@/lib/api/user";
import SearchBar from "@/components/layout/SearchBar";
import MobileMenu from "@/components/layout/MobileMenu";
import {
  BellIcon,
  CartIcon,
  ChevronDownIcon,
  MapPinIcon,
  MenuIcon,
  UserIcon,
} from "@/components/ui/Icons";

const asList = (data) =>
  Array.isArray(data) ? data : data?.content || [];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { pincode, serviceable, openModal } = useLocation();
  const toast = useToast();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [dropdown, setDropdown] = useState(null); // "categories" | "states" | "profile" | null
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getTopLevelCategories()
      .then((data) => {
        if (!cancelled) setCategories(asList(data));
      })
      .catch(() => {});
    getStates()
      .then((data) => {
        if (!cancelled) setStates(asList(data));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Unread notifications badge (bell icon).
  useEffect(() => {
    if (!isAuthenticated) return undefined;
    let cancelled = false;
    getUnreadCount()
      .then((data) => {
        if (!cancelled) setUnread(data?.unreadCount ?? 0);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const toggle = (name) => setDropdown((d) => (d === name ? null : name));
  const close = () => setDropdown(null);

  function handleLogout() {
    close();
    logout();
    toast.info("You've been logged out.");
    router.push("/");
  }

  const navLink =
    "text-sm font-medium text-ink/80 transition-colors hover:text-forest";
  const iconButton =
    "relative rounded-full p-2 text-ink/80 transition-colors hover:bg-forest/5 hover:text-forest";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-ivory shadow-sm">
        {/* Click-away backdrop for dropdowns */}
        {dropdown && (
          <button
            aria-hidden
            tabIndex={-1}
            onClick={close}
            className="fixed inset-0 z-10 cursor-default"
          />
        )}

        <nav className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
          {/* Mobile hamburger */}
          <button
            className="shrink-0 p-1 text-ink lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon.svg"
              alt=""
              className="h-8 w-8 shrink-0 rounded-full sm:h-9 sm:w-9"
            />
            <span className="flex items-baseline gap-1.5">
              <span className="truncate font-display text-lg leading-none text-forest sm:text-2xl">
                Kiran Sudha
              </span>
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-vermilion"
              />
            </span>
          </Link>

          {/* Desktop links */}
          <div className="relative z-20 ml-4 hidden items-center gap-6 lg:flex">
            <Link href="/products" className={navLink} onClick={close}>
              Shop All
            </Link>

            {/* Categories dropdown */}
            <div className="relative">
              <button
                className={`${navLink} inline-flex items-center gap-1`}
                aria-expanded={dropdown === "categories"}
                onClick={() => toggle("categories")}
              >
                Categories <ChevronDownIcon />
              </button>
              {dropdown === "categories" && (
                <div className="absolute left-0 top-9 w-60 rounded-xl bg-white py-2 shadow-lg ring-1 ring-ink/10">
                  {categories.length === 0 && (
                    <p className="px-4 py-2 text-sm text-ink/50">
                      No categories yet
                    </p>
                  )}
                  {categories.map((c) => (
                    <Link
                      key={c.id ?? c.slug}
                      href={`/categories/${c.slug}`}
                      onClick={close}
                      className="block px-4 py-2 text-sm text-ink hover:bg-ivory hover:text-forest"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* States dropdown */}
            <div className="relative">
              <button
                className={`${navLink} inline-flex items-center gap-1`}
                aria-expanded={dropdown === "states"}
                onClick={() => toggle("states")}
              >
                Browse by State <ChevronDownIcon />
              </button>
              {dropdown === "states" && (
                <div className="absolute left-0 top-9 max-h-96 w-72 overflow-y-auto rounded-xl bg-white py-2 shadow-lg ring-1 ring-ink/10">
                  {states.length === 0 && (
                    <p className="px-4 py-2 text-sm text-ink/50">
                      No states yet
                    </p>
                  )}
                  <div className="grid grid-cols-2">
                    {states.map((s) => (
                      <Link
                        key={s.id ?? s.slug}
                        href={`/states/${s.slug}`}
                        onClick={close}
                        className="block px-4 py-2 text-sm text-ink hover:bg-ivory hover:text-forest"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/offers" className={navLink} onClick={close}>
              Offers
            </Link>
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <SearchBar className="hidden w-64 md:block" />

            {/* Pincode / location */}
            <button
              onClick={openModal}
              className="hidden items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm text-ink/80 transition-colors hover:bg-forest/5 hover:text-forest sm:inline-flex"
              aria-label="Set delivery pincode"
            >
              <MapPinIcon className="h-4 w-4" />
              <span className="max-w-24 truncate">{pincode || "Pincode"}</span>
              {serviceable != null && (
                <span
                  aria-hidden
                  className={`inline-block h-1.5 w-1.5 rounded-full ${serviceable ? "bg-success" : "bg-vermilion"}`}
                />
              )}
            </button>

            {isAuthenticated && (
              <>
                {/* Notifications bell */}
                <Link
                  href="/notifications"
                  aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
                  className={iconButton}
                >
                  <BellIcon className="h-5 w-5" />
                  {unread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-vermilion px-1 text-[10px] font-semibold leading-none text-white">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </Link>

                {/* Cart — logged-in users only (per nav spec) */}
                <Link href="/cart" aria-label="Cart" className={iconButton}>
                  <CartIcon className="h-5 w-5" />
                </Link>
              </>
            )}

            {/* Profile */}
            <div className="relative z-20">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => toggle("profile")}
                    aria-expanded={dropdown === "profile"}
                    aria-label="Account menu"
                    className="flex items-center gap-1 rounded-full p-2 text-ink/80 transition-colors hover:bg-forest/5 hover:text-forest"
                  >
                    <UserIcon className="h-5 w-5" />
                    <ChevronDownIcon className="hidden h-3.5 w-3.5 sm:block" />
                  </button>
                  {dropdown === "profile" && (
                    <div className="absolute right-0 top-11 w-52 rounded-xl bg-white py-2 shadow-lg ring-1 ring-ink/10">
                      <p className="border-b border-ink/5 px-4 pb-2 pt-1 text-sm font-medium text-forest">
                        Hi, {user?.firstName || "there"}
                      </p>
                      {[
                        { href: "/wishlist", label: "Wishlist" },
                        { href: "/orders", label: "My Orders" },
                        { href: "/profile", label: "Profile & Addresses" },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={close}
                          className="block px-4 py-2 text-sm text-ink hover:bg-ivory hover:text-forest"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-sm text-vermilion hover:bg-ivory"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center rounded-full bg-forest px-4 text-sm font-medium text-ivory transition-colors hover:bg-forest-hover"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Rendered OUTSIDE the sticky header — a backdrop-filter/sticky
          ancestor becomes the containing block for position:fixed children,
          which clipped the drawer inside the header bar on small screens. */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={categories}
        states={states}
      />
    </>
  );
}
