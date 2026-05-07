"use client";

import { useEffect, useState } from "react";
import { TribalWaveBorder } from "@/app/components/AfricanDoodles";
import { TribalBorderSpiral } from "@/app/components/AfricanBorders";

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

interface Props {
  map: MapRecord;
  relatedMaps: MapRecord[];
  onClose: () => void;
  onSelectRelated: (map: MapRecord) => void;
}

export default function MapDetailModal({ map, relatedMaps, onClose, onSelectRelated }: Props) {
  const [zoom, setZoom] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const year = new Date(map.created_at).getFullYear();
  const hasPhotos = map.photos && map.photos.length > 0;

  // Lock body scroll and handle ESC
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxIndex !== null) setLightboxIndex(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, lightboxIndex]);

  return (
    <>
      {/* Modal */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* ── LEFT: Map image panel ── */}
        <div
          style={{
            width: "42%",
            flexShrink: 0,
            background: "#f0e9dc",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            borderRight: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          {/* Back button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "1.25rem",
              left: "1.25rem",
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 999,
              padding: "0.45rem 1rem",
              fontFamily: "var(--ff-heading)",
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "var(--forest-dark)",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            ← Back to Gallery
          </button>

          {/* Image area */}
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "5rem 3rem 2rem",
            }}
          >
            {map.map_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={map.map_image_url}
                alt={map.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  transform: `scale(${zoom})`,
                  transformOrigin: "center",
                  transition: "transform 0.2s ease",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  background: "rgba(0,0,0,0.06)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  fontFamily: "var(--ff-heading)",
                  fontSize: "0.85rem",
                }}
              >
                No image available
              </div>
            )}
          </div>

          {/* Zoom controls */}
          <div
            style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.35rem",
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: "var(--radius-sm)",
              padding: "0.5rem 0.4rem",
            }}
          >
            <button
              onClick={() => setZoom((z) => Math.min(+(z + 0.25).toFixed(2), 3))}
              style={zoomBtnStyle}
              title="Zoom in"
            >
              +
            </button>
            <span
              style={{
                fontFamily: "var(--ff-heading)",
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "var(--text-mid)",
                letterSpacing: "0.04em",
                padding: "0.2rem 0",
              }}
            >
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.max(+(z - 0.25).toFixed(2), 0.5))}
              style={zoomBtnStyle}
              title="Zoom out"
            >
              −
            </button>
            <div style={{ width: "100%", height: 1, background: "rgba(0,0,0,0.1)", margin: "0.1rem 0" }} />
            <button
              onClick={() => setZoom(1)}
              style={{ ...zoomBtnStyle, fontSize: "0.55rem", letterSpacing: "0.04em" }}
              title="Fit to view"
            >
              FIT
            </button>
          </div>

          {/* Download bar */}
          <div
            style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid rgba(0,0,0,0.07)",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {(map.map_pdf_url || map.map_image_url) && (
              <a
                href={map.map_pdf_url ?? map.map_image_url ?? ""}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
                style={{ fontSize: "0.82rem", padding: "0.6rem 1.6rem" }}
              >
                ↓ Download Map
              </a>
            )}
          </div>
        </div>

        {/* ── RIGHT: Detail panel ── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            background: "#faf8f4",
          }}
        >
          <div style={{ padding: "2rem 2.5rem 4rem" }}>
            {/* Breadcrumb */}
            <p
              style={{
                fontFamily: "var(--ff-heading)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "var(--jade)",
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            >
              BOESA · {year}
            </p>

            {/* Category tags */}
            {map.map_category?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.1rem" }}>
                {map.map_category.map((cat) => (
                  <span
                    key={cat}
                    style={{
                      fontFamily: "var(--ff-heading)",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      padding: "3px 10px",
                      borderRadius: 999,
                      background: "rgba(0,168,107,0.1)",
                      border: "1px solid rgba(0,168,107,0.3)",
                      color: "var(--jade)",
                    }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1
              style={{
                fontFamily: "var(--ff-display)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)",
                fontWeight: 900,
                color: "var(--forest-dark)",
                lineHeight: 1.1,
                marginBottom: map.subtitle ? "0.4rem" : "0.75rem",
              }}
            >
              {titleWithItalicLastWord(map.title)}
            </h1>

            {/* Subtitle */}
            {map.subtitle && (
              <p
                style={{
                  fontFamily: "var(--ff-body)",
                  fontSize: "1.05rem",
                  fontStyle: "italic",
                  color: "var(--text-mid)",
                  marginBottom: "0.75rem",
                  lineHeight: 1.4,
                }}
              >
                {map.subtitle}
              </p>
            )}

            <TribalWaveBorder width={160} color="#e1aa05" opacity={0.7} />

            {/* Description */}
            <p
              style={{
                fontFamily: "var(--ff-body)",
                fontSize: "1rem",
                color: "var(--text-mid)",
                lineHeight: 1.65,
                marginTop: "1.25rem",
                marginBottom: "2rem",
              }}
            >
              {map.description}
            </p>

            {/* Case Study */}
            {map.case_study && (
              <section style={{ marginBottom: "2.5rem" }}>
                <h2
                  style={{
                    fontFamily: "var(--ff-display)",
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    color: "var(--forest-dark)",
                    marginBottom: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ color: "var(--jade)", fontSize: "0.9rem" }}>●</span>
                  Case{" "}
                  <em style={{ fontStyle: "italic" }}>study</em>
                </h2>
                <div
                  style={{
                    background: "rgba(0,168,107,0.04)",
                    border: "1px solid rgba(0,168,107,0.12)",
                    borderLeft: "3px solid var(--jade)",
                    borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                    padding: "1.25rem 1.5rem",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--ff-body)",
                      fontSize: "0.92rem",
                      color: "var(--text-dark)",
                      lineHeight: 1.75,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {map.case_study}
                  </p>
                </div>
              </section>
            )}

            {/* Field Photographs */}
            {hasPhotos && (
              <section>
                <h2
                  style={{
                    fontFamily: "var(--ff-display)",
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    color: "var(--forest-dark)",
                    marginBottom: "0.4rem",
                  }}
                >
                  Field{" "}
                  <em style={{ fontStyle: "italic" }}>photographs</em>
                </h2>
                <p
                  style={{
                    fontFamily: "var(--ff-body)",
                    fontSize: "0.82rem",
                    color: "var(--text-muted)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Click any plate to enlarge. Captions below describe the moment of capture.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {map.photos.map((photo, i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "140px 1fr",
                        gap: "1.25rem",
                        alignItems: "start",
                      }}
                    >
                      {/* Thumbnail */}
                      <div>
                        <button
                          onClick={() => setLightboxIndex(i)}
                          style={{
                            display: "block",
                            width: "100%",
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "zoom-in",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.url}
                            alt={`Photo ${i + 1}`}
                            style={{
                              width: "100%",
                              aspectRatio: "4/3",
                              objectFit: "cover",
                              borderRadius: "var(--radius-sm)",
                              boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                            }}
                          />
                        </button>
                        <p
                          style={{
                            fontFamily: "var(--ff-heading)",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "var(--text-muted)",
                            marginTop: "0.4rem",
                            textAlign: "center",
                          }}
                        >
                          PLATE #{i + 1}
                        </p>
                      </div>

                      {/* Caption */}
                      <div>
                        <p
                          style={{
                            fontFamily: "var(--ff-heading)",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            color: "#e1aa05",
                            marginBottom: "0.5rem",
                          }}
                        >
                          FIELD PHOTOGRAPH · #{i + 1} OF {map.photos.length}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--ff-body)",
                            fontSize: "0.88rem",
                            color: "var(--text-dark)",
                            lineHeight: 1.65,
                          }}
                        >
                          {photo.description || "No caption provided."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {/* Related Maps */}
            {relatedMaps.length > 0 && (
              <section style={{ marginTop: "2.5rem" }}>
                <TribalBorderSpiral height={36} color1="#165a16" color2="#e1aa05" color3="#00a86b" opacity={0.45} />
                <h2
                  style={{
                    fontFamily: "var(--ff-display)",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "var(--forest-dark)",
                    marginBottom: "1rem",
                  }}
                >
                  Related <em style={{ fontStyle: "italic" }}>Maps</em>
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${relatedMaps.length}, 1fr)`, gap: "0.75rem" }}>
                  {relatedMaps.map((related) => {
                    const relYear = new Date(related.created_at).getFullYear();
                    return (
                      <div
                        key={related.id}
                        onClick={() => onSelectRelated(related)}
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
                        {related.map_image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={related.map_image_url}
                            alt={related.title}
                            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        )}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.04) 35%, rgba(0,0,0,0.65) 68%, rgba(0,0,0,0.9) 100%)",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "0.65rem",
                            right: "0.65rem",
                            background: "rgba(0,0,0,0.5)",
                            backdropFilter: "blur(6px)",
                            border: "1px solid rgba(255,255,255,0.18)",
                            borderRadius: 999,
                            padding: "2px 8px",
                            fontFamily: "var(--ff-heading)",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            color: "#fff",
                          }}
                        >
                          {relYear}
                        </div>
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0.85rem" }}>
                          <h3
                            style={{
                              fontFamily: "var(--ff-display)",
                              fontSize: "0.9rem",
                              fontWeight: 800,
                              color: "#fff",
                              marginBottom: "0.2rem",
                              lineHeight: 1.2,
                            }}
                          >
                            {related.title}
                          </h3>
                          {related.subtitle && (
                            <p style={{ fontFamily: "var(--ff-body)", fontSize: "0.7rem", fontStyle: "italic", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem", lineHeight: 1.3 }}>
                              {related.subtitle}
                            </p>
                          )}
                          <span style={{ fontFamily: "var(--ff-heading)", fontSize: "0.65rem", fontWeight: 700, color: "#e1aa05", letterSpacing: "0.08em" }}>
                            OPEN PLATE →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* ── Photo Lightbox ── */}
      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 999,
              width: 40,
              height: 40,
              color: "#fff",
              fontSize: "1.2rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>

          {lightboxIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
              style={lightboxNavBtn("left")}
            >
              ‹
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={map.photos[lightboxIndex].url}
            alt={`Photo ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90%",
              maxHeight: "85vh",
              objectFit: "contain",
              borderRadius: "var(--radius-md)",
              boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
            }}
          />

          {lightboxIndex < map.photos.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
              style={lightboxNavBtn("right")}
            >
              ›
            </button>
          )}

          <p
            style={{
              position: "absolute",
              bottom: "1.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "var(--ff-heading)",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.08em",
              textAlign: "center",
              maxWidth: "60%",
            }}
          >
            PLATE #{lightboxIndex + 1} OF {map.photos.length}
            {map.photos[lightboxIndex].description
              ? ` · ${map.photos[lightboxIndex].description}`
              : ""}
          </p>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .detail-modal-inner { flex-direction: column !important; }
          .detail-left-panel { width: 100% !important; height: 50vh !important; }
        }
      `}</style>
    </>
  );
}

function titleWithItalicLastWord(title: string) {
  const words = title.trim().split(" ");
  if (words.length <= 1) return <>{title}</>;
  const last = words.pop()!;
  return (
    <>
      {words.join(" ")}{" "}
      <em style={{ fontStyle: "italic" }}>{last}</em>
    </>
  );
}

const zoomBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  background: "none",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: "var(--radius-sm)",
  fontFamily: "var(--ff-heading)",
  fontSize: "0.95rem",
  fontWeight: 700,
  color: "var(--forest-dark)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function lightboxNavBtn(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    [side]: "1.5rem",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 999,
    width: 48,
    height: 48,
    color: "#fff",
    fontSize: "1.8rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}
