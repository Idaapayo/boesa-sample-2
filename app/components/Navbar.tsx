"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { TribalSun } from "./AfricanDoodles";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { href: "#about", label: "About" },
    { href: "#themes", label: "Themes" },
    { href: "#gallery", label: "Gallery" },
    { href: "#authors", label: "Authors" },
  ];

  return (
    <nav
      id="navbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.35s ease",
        background: scrolled
          ? "rgba(27,67,50,0.97)"
          : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.18)" : "none",
        padding: scrolled ? "0.75rem 0" : "1.25rem 0",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ position: "relative", width: 38, height: 38 }}>
            <TribalSun size={38} color="#D4A017" opacity={0.9} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--ff-display)", fontSize: "1.3rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>
              BOESA
            </div>
            <div style={{ fontFamily: "var(--ff-heading)", fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.65)", textTransform: "uppercase" }}>
              Biodiversity · Eastern & Southern Africa
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="nav-links">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontFamily: "var(--ff-heading)",
                fontSize: "0.88rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
                textDecoration: "none",
                transition: "color 0.2s",
                letterSpacing: "0.04em",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--gold-light)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.85)")}
            >
              {l.label}
            </a>
          ))}
          <a href="#order" className="btn btn-gold" style={{ padding: "0.6rem 1.4rem", fontSize: "0.82rem" }}>
            Get the Book
          </a>
        </div>

        {/* Hamburger */}
        <button
          id="nav-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
          }}
          className="nav-toggle"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            background: "rgba(27,67,50,0.98)",
            backdropFilter: "blur(16px)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ color: "#fff", fontFamily: "var(--ff-heading)", fontWeight: 600, textDecoration: "none", fontSize: "1rem" }}
            >
              {l.label}
            </a>
          ))}
          <a href="#order" className="btn btn-gold" style={{ alignSelf: "flex-start" }}>
            Get the Book
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
