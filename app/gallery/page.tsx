"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { TribalSun, TribalWaveBorder } from "@/app/components/AfricanDoodles";
import { TribalBorderDiamond } from "@/app/components/AfricanBorders";
import { supabaseAdmin } from "@/lib/supabase";
import MapDetailModal from "./MapDetailModal";
import { CATEGORIES } from "@/lib/categories";

interface MapRecord {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  map_image_url: string | null;
  map_pdf_url: string | null;
  photos: { url: string; description: string }[];
  case_study: string | null;
  map_category: string[];
  created_at: string;
}

export default function GalleryPage() {
  const [maps, setMaps] = useState<MapRecord[]>([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMap, setSelectedMap] = useState<MapRecord | null>(null);

  useEffect(() => {
    supabaseAdmin
      .from("map_uploads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setMaps((data as MapRecord[]) ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = maps.filter((m) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      (m.subtitle ?? "").toLowerCase().includes(q);
    const matchesCategory =
      !activeCategory || (m.map_category ?? []).includes(activeCategory);
    return matchesQuery && matchesCategory;
  });

  return (
    <>
      <Navbar />

      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #052e16 0%, #165a16 60%, #1a5c72 100%)",
          paddingTop: "7rem",
          paddingBottom: "3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{ position: "absolute", top: "10%", right: "4%", opacity: 0.25 }}
          className="anim-spin-slow"
        >
          <TribalSun size={200} color="#e1aa05" opacity={0.7} />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <p className="section-eyebrow">THE MAP GALLERY</p>
          <h1
            style={{
              fontFamily: "var(--ff-display)",
              fontSize: "clamp(2.2rem, 6vw, 4rem)",
              fontWeight: 900,
              color: "#fff",
              marginBottom: "0.5rem",
              lineHeight: 1.1,
            }}
          >
            Cartographies of{" "}
            <em style={{ fontStyle: "italic" }}>a Continent</em>
          </h1>
          <TribalWaveBorder width={200} color="#e1aa05" opacity={0.6} />
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              marginTop: "1rem",
              fontSize: "1rem",
              maxWidth: 560,
            }}
          >
            Field maps, plates, and cartographic records from BOESA researchers
            — each paired with photographs and case study notes.
          </p>
        </div>
        <div
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0 }}
        >
          <TribalBorderDiamond
            height={30}
            color1="#e1aa05"
            color2="#69382a"
            color3="#00a86b"
            opacity={0.5}
          />
        </div>
      </div>

      {/* Content */}
      <section
        className="section-pad"
        style={{ background: "var(--cream)", minHeight: "60vh" }}
      >
        <div className="container">
          {/* Search + count */}
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: "0.75rem",
              marginBottom: "2.5rem",
            }}
          >
            <div style={{ position: "relative", flex: 1 }}>
              <svg
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search maps, regions, themes…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem 0.85rem 2.75rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1.5px solid rgba(0,168,107,0.25)",
                  fontFamily: "var(--ff-body)",
                  fontSize: "0.95rem",
                  background: "#fff",
                  outline: "none",
                  color: "var(--text-dark)",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 1.25rem",
                background: "#fff",
                border: "1.5px solid rgba(0,168,107,0.2)",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--ff-heading)",
                whiteSpace: "nowrap",
                lineHeight: 1.2,
              }}
            >
              <span
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "var(--text-dark)",
                  letterSpacing: "0.04em",
                }}
              >
                {String(filtered.length).padStart(2, "0")} /{" "}
                {String(maps.length).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                }}
              >
                SHOWN
              </span>
            </div>
          </div>

          {/* Category filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
            <button
              onClick={() => setActiveCategory(null)}
              style={filterChipStyle(activeCategory === null)}
            >
              ALL
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.full}
                onClick={() => setActiveCategory(activeCategory === cat.full ? null : cat.full)}
                style={filterChipStyle(activeCategory === cat.full)}
              >
                {cat.label.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "5rem 0",
                color: "var(--text-muted)",
                fontFamily: "var(--ff-heading)",
                fontSize: "0.95rem",
                letterSpacing: "0.06em",
              }}
            >
              Loading maps…
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "5rem 0",
                color: "var(--text-muted)",
                fontFamily: "var(--ff-heading)",
                fontSize: "0.95rem",
              }}
            >
              {maps.length === 0
                ? "No maps uploaded yet."
                : "No maps match your search."}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.5rem",
              }}
              className="gallery-grid"
            >
              {filtered.map((map) => (
                <MapCard key={map.id} map={map} onOpen={() => setSelectedMap(map)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedMap && (
        <MapDetailModal
          map={selectedMap}
          relatedMaps={maps
            .filter(
              (m) =>
                m.id !== selectedMap.id &&
                (m.map_category ?? []).some((cat) =>
                  (selectedMap.map_category ?? []).includes(cat)
                )
            )
            .slice(0, 3)}
          onClose={() => setSelectedMap(null)}
          onSelectRelated={(m) => setSelectedMap(m)}
        />
      )}

      {/* Bottom border */}
      <div style={{ lineHeight: 0, background: "var(--cream)" }}>
        <TribalBorderDiamond
          height={36}
          color1="#e1aa05"
          color2="#69382a"
          color3="#00a86b"
          opacity={0.45}
        />
      </div>

      <style>{`
        @media (max-width: 900px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .gallery-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

function filterChipStyle(active: boolean): React.CSSProperties {
  return {
    fontFamily: "var(--ff-heading)",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    padding: "0.4rem 1rem",
    borderRadius: 999,
    border: `1.5px solid ${active ? "var(--jade)" : "rgba(0,168,107,0.25)"}`,
    background: active ? "var(--jade)" : "#fff",
    color: active ? "#fff" : "var(--text-mid)",
    cursor: "pointer",
    transition: "all 0.15s",
  };
}

function MapCard({ map, onOpen }: { map: MapRecord; onOpen: () => void }) {
  const year = new Date(map.created_at).getFullYear();

  return (
    <div
      onClick={onOpen}
      style={{
        position: "relative",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        aspectRatio: "3 / 4",
        background: "#0e2b1a",
        boxShadow: "var(--shadow-card)",
        cursor: "pointer",
      }}
    >
      {/* Map image */}
      {map.map_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={map.map_image_url}
          alt={map.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.04) 35%, rgba(0,0,0,0.65) 68%, rgba(0,0,0,0.9) 100%)",
        }}
      />

      {/* Year badge */}
      <div
        style={{
          position: "absolute",
          top: "0.9rem",
          right: "0.9rem",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 999,
          padding: "3px 11px",
          fontFamily: "var(--ff-heading)",
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "0.04em",
        }}
      >
        {year}
      </div>

      {/* Bottom content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "1.25rem",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--ff-display)",
            fontSize: "clamp(1rem, 2vw, 1.3rem)",
            fontWeight: 800,
            color: "#fff",
            marginBottom: "0.2rem",
            lineHeight: 1.2,
          }}
        >
          {map.title}
        </h3>
        {map.subtitle && (
          <p
            style={{
              fontFamily: "var(--ff-body)",
              fontSize: "0.78rem",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.6)",
              marginBottom: "0.35rem",
              lineHeight: 1.3,
            }}
          >
            {map.subtitle}
          </p>
        )}
        <p
          style={{
            fontFamily: "var(--ff-body)",
            fontSize: "0.78rem",
            color: "rgba(255,255,255,0.55)",
            marginBottom: "1rem",
            lineHeight: 1.45,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          } as React.CSSProperties}
        >
          {map.description}
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span
            style={{
              fontFamily: "var(--ff-heading)",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#e1aa05",
              letterSpacing: "0.08em",
            }}
          >
            OPEN PLATE →
          </span>
        </div>
      </div>
    </div>
  );
}
