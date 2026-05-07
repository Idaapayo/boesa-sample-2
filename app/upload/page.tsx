"use client";

import { useState, useRef } from "react";
import Navbar from "@/app/components/Navbar";
import { TribalSun, TribalWaveBorder } from "@/app/components/AfricanDoodles";
import { TribalBorderDiamond } from "@/app/components/AfricanBorders";
import { CATEGORIES } from "@/lib/categories";

interface PhotoEntry {
  id: number;
  file: File | null;
  previewUrl: string | null;
  description: string;
  keyword: string;
}

interface UnsplashPhoto {
  id: string;
  urls: { small: string; regular: string };
  alt_description: string | null;
  user: { name: string };
  links: { html: string };
}

interface PhotoSuggestState {
  loading: boolean;
  photos: UnsplashPhoto[];
  error: string | null;
}

interface CsSuggestion {
  sampleStudy: string;
  references: { title: string; description: string; source?: string }[];
}

let nextId = 0;
function makePhoto(): PhotoEntry {
  return { id: nextId++, file: null, previewUrl: null, description: "", keyword: "" };
}

type Status = "idle" | "submitting" | "success" | "error";

export default function UploadPage() {
  const [photos, setPhotos] = useState<PhotoEntry[]>([makePhoto()]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const [canSuggestCaseStudy, setCanSuggestCaseStudy] = useState(false);

  function checkMapDetails() {
    setCanSuggestCaseStudy(
      !!getFormText("title") && !!getFormText("subtitle") && !!getFormText("description")
    );
  }

  // AI: photo suggestions
  const [photoSuggestOpenId, setPhotoSuggestOpenId] = useState<number | null>(null);
  const [photoSuggestCache, setPhotoSuggestCache] = useState<Record<number, PhotoSuggestState>>({});

  // AI: case study modal
  const [csModalOpen, setCsModalOpen] = useState(false);
  const [csLoading, setCsLoading] = useState(false);
  const [csSuggestion, setCsSuggestion] = useState<CsSuggestion | null>(null);
  const [csError, setCsError] = useState<string | null>(null);

  function toggleCategory(full: string) {
    setSelectedCategories((prev) =>
      prev.includes(full) ? prev.filter((c) => c !== full) : [...prev, full]
    );
  }

  function addPhoto() {
    setPhotos((prev) => [...prev, makePhoto()]);
  }

  function removePhoto(id: number) {
    setPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      return updated.length === 0 ? [makePhoto()] : updated;
    });
  }

  function updatePhotoFile(id: number, file: File | null) {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, file, previewUrl: file ? URL.createObjectURL(file) : null }
          : p
      )
    );
  }

  function updatePhotoDesc(id: number, description: string) {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, description } : p))
    );
  }

  function updatePhotoKeyword(id: number, keyword: string) {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, keyword } : p))
    );
  }

  function getFormText(name: string): string {
    const form = formRef.current;
    if (!form) return "";
    const el = form.elements.namedItem(name) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;
    return el?.value?.trim() ?? "";
  }

  /* ── AI: Photo suggest ── */
  async function fetchPhotoSuggestions(photoId: number) {
    const keyword = photos.find((p) => p.id === photoId)?.keyword.trim() ?? "";

    if (!keyword) {
      setPhotoSuggestCache((prev) => ({
        ...prev,
        [photoId]: { loading: false, photos: [], error: "Please enter a search keyword first." },
      }));
      setPhotoSuggestOpenId(photoId);
      return;
    }

    setPhotoSuggestCache((prev) => ({
      ...prev,
      [photoId]: { loading: true, photos: [], error: null },
    }));
    setPhotoSuggestOpenId(photoId);

    try {
      const res = await fetch("/api/ai/photo-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json();
      setPhotoSuggestCache((prev) => ({
        ...prev,
        [photoId]: {
          loading: false,
          photos: data.photos ?? [],
          error: data.error ?? null,
        },
      }));
    } catch {
      setPhotoSuggestCache((prev) => ({
        ...prev,
        [photoId]: { loading: false, photos: [], error: "Network error." },
      }));
    }
  }

  async function useUnsplashPhoto(
    photoId: number,
    regularUrl: string,
    alt: string | null
  ) {
    try {
      const res = await fetch(
        `/api/ai/image-proxy?url=${encodeURIComponent(regularUrl)}`
      );
      const blob = await res.blob();
      const file = new File([blob], "unsplash-photo.jpg", {
        type: blob.type || "image/jpeg",
      });
      updatePhotoFile(photoId, file);
      if (!photos.find((p) => p.id === photoId)?.description && alt) {
        updatePhotoDesc(photoId, alt);
      }
      setPhotoSuggestOpenId(null);
    } catch {
      alert("Could not download photo. Please try another.");
    }
  }

  /* ── AI: Case study suggest ── */
  async function fetchCaseStudySuggestion() {
    setCsModalOpen(true);
    setCsLoading(true);
    setCsSuggestion(null);
    setCsError(null);

    try {
      const res = await fetch("/api/ai/case-study-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: getFormText("title"),
          subtitle: getFormText("subtitle"),
          description: getFormText("description"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unknown error");
      setCsSuggestion(data);
    } catch (err) {
      setCsError(err instanceof Error ? err.message : "Failed to generate.");
    } finally {
      setCsLoading(false);
    }
  }

  function insertCaseStudy(text: string) {
    const el = formRef.current?.elements.namedItem(
      "case_study"
    ) as HTMLTextAreaElement | null;
    if (el) el.value = text;
    setCsModalOpen(false);
  }

  /* ── Dev tool ── */
  async function fillSampleData() {
    const form = formRef.current;
    if (!form) return;

    const setText = (name: string, value: string) => {
      const el = form.elements.namedItem(name) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;
      if (el) el.value = value;
    };
    setText("title", "Eastern Africa Biodiversity Hotspots");
    setText("subtitle", "A cartographic analysis of the Eastern Arc Mountains");
    setText(
      "description",
      "Sample map description generated for development. Highlights regions of high endemism across the Eastern Arc."
    );
    setText(
      "case_study",
      "Sample case study text covering conservation outcomes, stakeholder engagement, and lessons learned."
    );
    setSelectedCategories(["Country Profiles", "Endangered and Invasive Species"]);

    const setFile = (name: string, file: File) => {
      const input = form.elements.namedItem(name) as HTMLInputElement | null;
      if (!input) return;
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
    };
    setFile("map_image", await makeSampleJpeg("sample-map.jpg", "MAP"));
    setFile("map_pdf", makeSamplePdf("sample-map.pdf"));

    const photoFile = await makeSampleJpeg("sample-photo.jpg", "PHOTO");
    const firstId = photos[0]?.id;
    if (firstId !== undefined) {
      updatePhotoFile(firstId, photoFile);
      updatePhotoDesc(firstId, "Sample associated photo description.");
      updatePhotoKeyword(firstId, "eastern africa biodiversity");
    }
    checkMapDetails();
  }

  /* ── Submit ── */
  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);

    photos.forEach((photo, index) => {
      if (photo.file) {
        fd.append(`photo_file_${index}`, photo.file);
        fd.append(`photo_desc_${index}`, photo.description);
      }
    });

    selectedCategories.forEach((cat) => fd.append("map_category", cat));

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Upload failed.");
        setStatus("error");
        return;
      }
      setStatus("success");
      formRef.current?.reset();
      setPhotos([makePhoto()]);
      setSelectedCategories([]);
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  const submitting = status === "submitting";

  return (
    <>
      <Navbar />

      {/* ── Header ── */}
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
          <TribalSun size={160} color="#e1aa05" opacity={0.7} />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <p className="section-eyebrow">Content Management</p>
          <h1
            style={{
              fontFamily: "var(--ff-display)",
              fontSize: "clamp(2rem,5vw,3.5rem)",
              fontWeight: 900,
              color: "#fff",
              marginBottom: "0.5rem",
            }}
          >
            BOESA Book Title Upload
          </h1>
          <TribalWaveBorder width={200} color="#e1aa05" opacity={0.6} />
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              marginTop: "1rem",
              fontSize: "1rem",
            }}
          >
            Submit map details, associated imagery, and case study content.
          </p>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <TribalBorderDiamond height={30} color1="#e1aa05" color2="#69382a" color3="#00a86b" opacity={0.5} />
        </div>
      </div>

      {/* ── Form ── */}
      <section className="section-pad" style={{ background: "var(--cream)" }}>
        <div className="container" style={{ maxWidth: 780 }}>
          {status === "success" && (
            <div style={alertStyle("success")}>Submission saved successfully!</div>
          )}
          {status === "error" && (
            <div style={alertStyle("error")}>{errorMsg}</div>
          )}

          {process.env.NODE_ENV !== "production" && (
            <div style={devToolsStyle}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: "#856404" }}>
                DEV TOOLS
              </span>
              <button type="button" onClick={fillSampleData} style={devBtnStyle}>
                Fill sample data
              </button>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} onChange={checkMapDetails} noValidate>
            {/* Map Details */}
            <Card title="Map Details">
              <Field label="Title of the Map" required>
                <input type="text" name="title" placeholder="e.g. Eastern Africa Biodiversity Hotspots" required style={inputStyle} />
              </Field>
              <Field label="Subtitle">
                <input type="text" name="subtitle" placeholder="e.g. A cartographic analysis of the Eastern Arc Mountains" style={inputStyle} />
              </Field>
              <Field label="Description" required>
                <textarea name="description" placeholder="Provide a detailed description of the map…" required rows={4} style={{ ...inputStyle, resize: "vertical" }} />
              </Field>
            </Card>

            {/* Map Category */}
            <Card title="Map Category">
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                Select all categories that apply to this map.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {CATEGORIES.map((cat) => {
                  const checked = selectedCategories.includes(cat.full);
                  return (
                    <label
                      key={cat.full}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem 1rem",
                        borderRadius: "var(--radius-sm)",
                        border: `1.5px solid ${checked ? "var(--jade)" : "rgba(0,168,107,0.2)"}`,
                        background: checked ? "rgba(0,168,107,0.06)" : "#fafafa",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCategory(cat.full)}
                        style={{ accentColor: "var(--jade)", width: 16, height: 16, cursor: "pointer" }}
                      />
                      <span style={{ fontFamily: "var(--ff-body)", fontSize: "0.92rem", color: checked ? "var(--forest-dark)" : "var(--text-mid)", fontWeight: checked ? 600 : 400 }}>
                        {cat.full}
                      </span>
                    </label>
                  );
                })}
              </div>
            </Card>

            {/* Map Files */}
            <Card title="Map Files">
              <Field label="Map Image (JPEG)">
                <FileInput name="map_image" accept="image/jpeg,image/jpg" hint="JPEG only" />
              </Field>
              <Field label="Map PDF">
                <FileInput name="map_pdf" accept="application/pdf" hint="PDF only" />
              </Field>
            </Card>

            {/* Associated Photos */}
            <Card title="Associated Photos">
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                Add photos related to this map. Use <strong>AI Suggest</strong> to find relevant royalty-free options from Unsplash.
              </p>

              {photos.map((photo, index) => {
                const suggestState = photoSuggestCache[photo.id];
                const suggestOpen = photoSuggestOpenId === photo.id;

                return (
                  <div
                    key={photo.id}
                    style={{
                      border: "1px solid rgba(0,168,107,0.2)",
                      borderRadius: "var(--radius-md)",
                      padding: "1.25rem",
                      marginBottom: "1rem",
                      background: "#fff",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <span style={{ fontFamily: "var(--ff-heading)", fontSize: "0.8rem", fontWeight: 600, color: "var(--jade)" }}>
                        Photo {index + 1}
                      </span>
                      {photos.length > 1 && (
                        <button type="button" onClick={() => removePhoto(photo.id)} style={removeBtnStyle}>
                          Remove
                        </button>
                      )}
                    </div>

                    <Field label="Photo File">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => updatePhotoFile(photo.id, e.target.files?.[0] ?? null)}
                        style={fileInputStyle}
                      />
                    </Field>

                    {/* Keyword + AI Suggest row */}
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.25rem" }}>
                      <input
                        type="text"
                        placeholder="Search keyword (e.g. wildlife corridor)"
                        value={photo.keyword}
                        onChange={(e) => updatePhotoKeyword(photo.id, e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); fetchPhotoSuggestions(photo.id); } }}
                        style={{ ...inputStyle, flex: 1, marginBottom: 0, fontSize: "0.88rem" }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          suggestOpen
                            ? setPhotoSuggestOpenId(null)
                            : fetchPhotoSuggestions(photo.id)
                        }
                        style={{ ...aiSuggestBtnStyle(suggestOpen), marginBottom: 0, whiteSpace: "nowrap" }}
                      >
                        ✨ AI Suggest
                      </button>
                    </div>

                    {/* Photo suggestion panel */}
                    {suggestOpen && (
                      <PhotoSuggestPanel
                        state={suggestState ?? { loading: true, photos: [], error: null }}
                        onUse={(url, alt) => useUnsplashPhoto(photo.id, url, alt)}
                        onClose={() => setPhotoSuggestOpenId(null)}
                      />
                    )}

                    {photo.previewUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo.previewUrl}
                        alt="preview"
                        style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: "var(--radius-sm)", marginBottom: "0.75rem", marginTop: "0.75rem" }}
                      />
                    )}

                    <Field label="Short Description">
                      <textarea
                        placeholder="Describe what this photo shows…"
                        value={photo.description}
                        onChange={(e) => updatePhotoDesc(photo.id, e.target.value)}
                        rows={2}
                        style={{ ...inputStyle, resize: "vertical" }}
                      />
                    </Field>
                  </div>
                );
              })}

              <button type="button" onClick={addPhoto} style={addPhotoBtnStyle}>
                + Add Another Photo
              </button>
            </Card>

            {/* Case Study */}
            <Card title="Case Study">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", margin: 0 }}>
                  Describe the case study associated with this map.
                </p>
                {canSuggestCaseStudy && (
                  <button
                    type="button"
                    onClick={fetchCaseStudySuggestion}
                    style={aiSuggestBtnStyle(false)}
                  >
                    ✨ AI Suggest
                  </button>
                )}
              </div>
              <textarea
                name="case_study"
                placeholder="Describe the case study associated with this map…"
                rows={6}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </Card>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-gold"
                style={{ fontSize: "1rem", padding: "0.9rem 2.4rem", opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? "Uploading…" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Case study AI modal */}
      {csModalOpen && (
        <CaseStudyModal
          loading={csLoading}
          suggestion={csSuggestion}
          error={csError}
          onClose={() => setCsModalOpen(false)}
          onInsert={insertCaseStudy}
        />
      )}
    </>
  );
}

/* ── PhotoSuggestPanel ── */

function PhotoSuggestPanel({
  state,
  onUse,
  onClose,
}: {
  state: PhotoSuggestState;
  onUse: (url: string, alt: string | null) => void;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        border: "1.5px solid rgba(0,168,107,0.25)",
        borderRadius: "var(--radius-md)",
        background: "#f5fdf9",
        padding: "1rem",
        margin: "0.75rem 0",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <span style={{ fontFamily: "var(--ff-heading)", fontSize: "0.78rem", fontWeight: 700, color: "var(--jade)", letterSpacing: "0.06em" }}>
          ✨ AI PHOTO SUGGESTIONS · Unsplash
        </span>
        <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1 }}>
          ✕
        </button>
      </div>

      {state.loading && (
        <div style={{ textAlign: "center", padding: "1.5rem 0", color: "var(--text-muted)", fontFamily: "var(--ff-heading)", fontSize: "0.82rem" }}>
          Searching for relevant photos…
        </div>
      )}

      {state.error && (
        <div style={{ color: "#721c24", background: "#f8d7da", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", fontFamily: "var(--ff-body)", fontSize: "0.85rem" }}>
          {state.error}
        </div>
      )}

      {!state.loading && !state.error && state.photos.length === 0 && (
        <div style={{ textAlign: "center", padding: "1rem 0", color: "var(--text-muted)", fontFamily: "var(--ff-body)", fontSize: "0.85rem" }}>
          No photos found.
        </div>
      )}

      {state.photos.length > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
            {state.photos.map((photo) => (
              <div key={photo.id} style={{ position: "relative", borderRadius: "var(--radius-sm)", overflow: "hidden", aspectRatio: "4/3", background: "#ddd" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.urls.small}
                  alt={photo.alt_description ?? "photo"}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0)",
                    transition: "background 0.15s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.25rem",
                  }}
                  className="photo-hover-overlay"
                >
                  <button
                    type="button"
                    onClick={() => onUse(photo.urls.regular, photo.alt_description)}
                    style={{
                      background: "var(--jade)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 999,
                      padding: "0.35rem 0.85rem",
                      fontFamily: "var(--ff-heading)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      opacity: 0,
                      transition: "opacity 0.15s",
                    }}
                    className="photo-use-btn"
                  >
                    Use
                  </button>
                </div>
                <p
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    margin: 0,
                    padding: "0.2rem 0.4rem",
                    background: "rgba(0,0,0,0.55)",
                    fontFamily: "var(--ff-heading)",
                    fontSize: "0.55rem",
                    color: "rgba(255,255,255,0.8)",
                    letterSpacing: "0.03em",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {photo.user.name}
                </p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "var(--ff-body)", marginTop: "0.5rem" }}>
            Photos by Unsplash contributors. Hover a photo and click <strong>Use</strong> to set it.
          </p>
        </>
      )}

      <style>{`
        .photo-hover-overlay:hover { background: rgba(0,0,0,0.35) !important; }
        .photo-hover-overlay:hover .photo-use-btn { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

/* ── CaseStudyModal ── */

function CaseStudyModal({
  loading,
  suggestion,
  error,
  onClose,
  onInsert,
}: {
  loading: boolean;
  suggestion: CsSuggestion | null;
  error: string | null;
  onClose: () => void;
  onInsert: (text: string) => void;
}) {
  const [tab, setTab] = useState<"sample" | "references">("sample");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#faf8f4",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 20px 80px rgba(0,0,0,0.3)",
          width: "100%",
          maxWidth: 720,
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fff",
          }}
        >
          <div>
            <p style={{ fontFamily: "var(--ff-heading)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--jade)", marginBottom: "0.15rem" }}>
              ✨ AI SUGGEST
            </p>
            <h3 style={{ fontFamily: "var(--ff-display)", fontSize: "1.15rem", fontWeight: 800, color: "var(--forest-dark)", margin: 0 }}>
              Case Study Suggestions
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "1px solid rgba(0,0,0,0.15)", borderRadius: 999, width: 32, height: 32, cursor: "pointer", fontSize: "1rem", color: "var(--text-mid)", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {loading && (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <div style={{ fontFamily: "var(--ff-heading)", fontSize: "0.88rem", color: "var(--text-muted)", letterSpacing: "0.06em" }}>
                Generating case study suggestions…
              </div>
              <div style={{ marginTop: "1rem", width: 36, height: 36, border: "3px solid rgba(0,168,107,0.15)", borderTop: "3px solid var(--jade)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "1rem auto 0" }} />
            </div>
          )}

          {error && (
            <div style={{ color: "#721c24", background: "#f8d7da", borderRadius: "var(--radius-sm)", padding: "1rem 1.25rem", fontFamily: "var(--ff-body)", fontSize: "0.9rem" }}>
              {error}
            </div>
          )}

          {suggestion && (
            <>
              {/* Tabs */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <button
                  onClick={() => setTab("sample")}
                  style={csTabStyle(tab === "sample")}
                >
                  Sample Case Study
                </button>
                <button
                  onClick={() => setTab("references")}
                  style={csTabStyle(tab === "references")}
                >
                  Related References ({suggestion.references.length})
                </button>
              </div>

              {tab === "sample" && (
                <div>
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(0,168,107,0.15)",
                      borderLeft: "3px solid var(--jade)",
                      borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                      padding: "1.25rem 1.5rem",
                      fontFamily: "var(--ff-body)",
                      fontSize: "0.9rem",
                      lineHeight: 1.8,
                      color: "var(--text-dark)",
                      whiteSpace: "pre-wrap",
                      marginBottom: "1.25rem",
                    }}
                  >
                    {suggestion.sampleStudy}
                  </div>
                  <button
                    onClick={() => onInsert(suggestion.sampleStudy)}
                    className="btn btn-gold"
                    style={{ fontSize: "0.85rem", padding: "0.65rem 1.5rem" }}
                  >
                    ↓ Insert into Form
                  </button>
                </div>
              )}

              {tab === "references" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {suggestion.references.map((ref, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#fff",
                        border: "1px solid rgba(0,0,0,0.07)",
                        borderRadius: "var(--radius-sm)",
                        padding: "1rem 1.25rem",
                      }}
                    >
                      <p style={{ fontFamily: "var(--ff-heading)", fontSize: "0.82rem", fontWeight: 700, color: "var(--forest-dark)", marginBottom: "0.4rem" }}>
                        {ref.title}
                      </p>
                      <p style={{ fontFamily: "var(--ff-body)", fontSize: "0.85rem", color: "var(--text-mid)", lineHeight: 1.6, marginBottom: ref.source ? "0.4rem" : 0 }}>
                        {ref.description}
                      </p>
                      {ref.source && (
                        <p style={{ fontFamily: "var(--ff-heading)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.06em", color: "var(--jade)", textTransform: "uppercase" }}>
                          {ref.source}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Sub-components ── */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-card)", padding: "2rem", marginBottom: "1.75rem" }}>
      <h2 style={{ fontFamily: "var(--ff-display)", fontSize: "1.25rem", fontWeight: 700, color: "var(--forest-dark)", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "2px solid rgba(0,168,107,0.15)" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{ display: "block", fontFamily: "var(--ff-heading)", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-mid)", marginBottom: "0.5rem", letterSpacing: "0.04em" }}>
        {label}
        {required && <span style={{ color: "#d9534f", marginLeft: 4 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function FileInput({ name, accept, hint }: { name: string; accept: string; hint?: string }) {
  return (
    <div>
      <input type="file" name={name} accept={accept} style={fileInputStyle} />
      {hint && <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>{hint}</p>}
    </div>
  );
}

/* ── Styles ── */

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 1rem",
  borderRadius: "var(--radius-sm)",
  border: "1.5px solid rgba(0,168,107,0.25)",
  fontFamily: "var(--ff-body)",
  fontSize: "0.95rem",
  color: "var(--text-dark)",
  background: "#fafafa",
  outline: "none",
  transition: "border-color 0.2s",
};

const fileInputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "0.6rem 0.9rem",
  borderRadius: "var(--radius-sm)",
  border: "1.5px dashed rgba(0,168,107,0.35)",
  fontFamily: "var(--ff-body)",
  fontSize: "0.9rem",
  color: "var(--text-mid)",
  background: "#f5fdf9",
  cursor: "pointer",
};

const removeBtnStyle: React.CSSProperties = {
  fontFamily: "var(--ff-heading)",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "#d9534f",
  background: "transparent",
  border: "1px solid #d9534f",
  borderRadius: 999,
  padding: "3px 12px",
  cursor: "pointer",
};

const addPhotoBtnStyle: React.CSSProperties = {
  fontFamily: "var(--ff-heading)",
  fontSize: "0.88rem",
  fontWeight: 600,
  color: "var(--jade)",
  background: "rgba(0,168,107,0.08)",
  border: "1.5px dashed rgba(0,168,107,0.4)",
  borderRadius: "var(--radius-md)",
  padding: "0.65rem 1.5rem",
  cursor: "pointer",
  width: "100%",
  transition: "background 0.2s",
};

const devToolsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  padding: "0.75rem 1rem",
  marginBottom: "1.5rem",
  borderRadius: "var(--radius-sm)",
  background: "#fff3cd",
  border: "1px dashed #e1aa05",
};

const devBtnStyle: React.CSSProperties = {
  fontFamily: "var(--ff-heading)",
  fontSize: "0.82rem",
  fontWeight: 600,
  color: "#7a5800",
  background: "#ffe79a",
  border: "1px solid #e1aa05",
  borderRadius: "var(--radius-sm)",
  padding: "0.4rem 0.9rem",
  cursor: "pointer",
};

function aiSuggestBtnStyle(active: boolean): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    fontFamily: "var(--ff-heading)",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    color: active ? "#fff" : "var(--jade)",
    background: active ? "var(--jade)" : "rgba(0,168,107,0.07)",
    border: `1.5px solid ${active ? "var(--jade)" : "rgba(0,168,107,0.3)"}`,
    borderRadius: 999,
    padding: "0.4rem 0.9rem",
    cursor: "pointer",
    marginBottom: "0.75rem",
    transition: "all 0.15s",
  };
}

function csTabStyle(active: boolean): React.CSSProperties {
  return {
    fontFamily: "var(--ff-heading)",
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    padding: "0.5rem 1.1rem",
    borderRadius: 999,
    border: `1.5px solid ${active ? "var(--jade)" : "rgba(0,0,0,0.12)"}`,
    background: active ? "var(--jade)" : "transparent",
    color: active ? "#fff" : "var(--text-mid)",
    cursor: "pointer",
    transition: "all 0.15s",
  };
}

function alertStyle(type: "success" | "error"): React.CSSProperties {
  return {
    padding: "1rem 1.25rem",
    borderRadius: "var(--radius-sm)",
    marginBottom: "1.5rem",
    fontFamily: "var(--ff-body)",
    fontSize: "0.95rem",
    background: type === "success" ? "#d4edda" : "#f8d7da",
    color: type === "success" ? "#155724" : "#721c24",
    border: `1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
  };
}

function makeSampleJpeg(filename: string, label: string): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 160;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#165a16";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#e1aa05";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, canvas.width / 2, canvas.height / 2);
    canvas.toBlob(
      (blob) => resolve(new File([blob!], filename, { type: "image/jpeg" })),
      "image/jpeg",
      0.85
    );
  });
}

function makeSamplePdf(filename: string): File {
  const pdf = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 200]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 56>>stream
BT /F1 24 Tf 60 100 Td (BOESA Sample PDF) Tj ET
endstream endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000053 00000 n
0000000098 00000 n
0000000183 00000 n
0000000280 00000 n
trailer<</Size 6/Root 1 0 R>>
startxref
345
%%EOF`;
  return new File([pdf], filename, { type: "application/pdf" });
}
