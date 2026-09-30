"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/articles", label: "Articles" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const open = menuPath === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuPath(null);
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setMenuPath(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (active: boolean) =>
    `relative block rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
      active
        ? "bg-accent/10 text-accent-light"
        : "text-muted hover:bg-surface hover:text-foreground"
    }`;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div
          ref={navRef}
          data-scrolled={scrolled || open}
          className="pointer-events-auto flex items-center justify-between gap-2 rounded-full border border-transparent px-2 py-1.5 transition-all duration-300 data-[scrolled=true]:border-border data-[scrolled=true]:bg-background/70 data-[scrolled=true]:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.9)] data-[scrolled=true]:backdrop-blur-xl"
        >
          <Link
            href="/"
            aria-label="Ankit Kumar — home"
            className="group flex shrink-0 items-center gap-2 pl-1 pr-1"
          >
            <span className="relative grid h-7 w-7 place-items-center rounded-full bg-accent/15 text-[11px] font-bold text-accent-light ring-1 ring-accent/30 transition-colors group-hover:bg-accent/25">
              AK
            </span>
            <span className="hidden text-sm font-semibold tracking-tight text-foreground sm:block">
              Ankit Kumar
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 sm:flex" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={linkClass(isActive(link.href))}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <a
            href="/Ankit_Kumar_Singh_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 rounded-full bg-accent px-3.5 py-1.5 text-sm font-medium text-background transition-colors hover:bg-accent-light sm:block"
          >
            Resume
          </a>

          <button
            type="button"
            onClick={() => setMenuPath(open ? null : pathname)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-foreground sm:hidden"
          >
            <span className="relative block h-3.5 w-4">
              <span
                className={`absolute left-0 top-0 block h-px w-full bg-current transition-transform duration-300 ${
                  open ? "translate-y-[6.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] block h-px w-full bg-current transition-transform duration-300 ${
                  open ? "-rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        {open && (
          <nav
            aria-label="Mobile"
            className="pointer-events-auto mt-2 overflow-hidden rounded-2xl border border-border bg-background/80 p-1.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`block rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-accent/10 text-accent-light"
                    : "text-muted hover:bg-surface hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/Ankit_Kumar_Singh_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block rounded-xl bg-accent px-3.5 py-2.5 text-center text-sm font-medium text-background transition-colors hover:bg-accent-light"
            >
              Resume
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}