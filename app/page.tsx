"use client";
import Image from "next/image";
import Navbar from "./components/Navbar";
import {
  TribalSun, AdinkraDiamond, AfricanLeaf, KenteCircle,
  TribalWaveBorder, TribalDots, CornerOrnament,
} from "./components/AfricanDoodles";
import {
  TribalBorderDiamond,
  TribalBorderSpiral,
  TribalBorderGeometric,
} from "./components/AfricanBorders";

/* ─── Photo data ─────────────────────────────────────── */
const BIODIVERSITY = [
  { src: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80", alt: "African elephants on savanna", caption: "Savanna Giants" },
  { src: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=80", alt: "Lion portrait", caption: "Apex Predators" },
  { src: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&q=80", alt: "African wildlife", caption: "Rift Valley Lakes" },
  { src: "https://images.unsplash.com/photo-1612774412771-005ed8e861d2?w=800&q=80", alt: "Zebra herd at waterhole", caption: "Great Migrations" },
  { src: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800&q=80", alt: "Giraffe at sunset", caption: "Iconic Species" },
];

const FORESTS = [
  { src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80", alt: "Dense forest canopy", caption: "Ancient Canopies" },
  { src: "https://images.unsplash.com/photo-1504198266287-1659872e6590?w=800&q=80", alt: "Misty mountain forest", caption: "Afromontane Mist" },
  { src: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80", alt: "Forest floor sunlight", caption: "Forest Floor Life" },
  { src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80", alt: "Aerial forest view", caption: "Carbon Sinks" },
];

const SEASCAPES = [
  { src: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&q=80", alt: "Coral reef underwater", caption: "Coral Kingdoms" },
  { src: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80", alt: "Tropical coastline", caption: "Indian Ocean Coast" },
  { src: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80", alt: "Sea turtle swimming", caption: "Marine Giants" },
  { src: "https://images.unsplash.com/photo-1682687220208-22d7a2543e88?w=800&q=80", alt: "Clear turquoise water", caption: "Crystal Waters" },
];

const STATS = [
  { n: "24", unit: "Countries", label: "Covered" },
  { n: "8K+", unit: "Species", label: "Documented" },
  { n: "3", unit: "Themes", label: "In-depth" },
  { n: "50+", unit: "Years", label: "Experience" },
];

/* ─── Gallery strip ──────────────────────────────────── */
function PhotoStrip({ items, height = 260 }: { items: typeof BIODIVERSITY; height?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: "0.75rem" }}>
      {items.map((p, i) => (
        <div key={i} className="photo-card" style={{ height }}>
          <Image src={p.src} alt={p.alt} fill sizes="(max-width:600px) 100vw, 25vw" style={{ objectFit: "cover" }} />
          <div className="photo-card-overlay"><p>{p.caption}</p></div>
        </div>
      ))}
    </div>
  );
}

/* ─── Theme card ─────────────────────────────────────── */
function ThemeCard({
  src, alt, tag, tagClass, icon, title, desc,
}: { src: string; alt: string; tag: string; tagClass: string; icon: string; title: string; desc: string }) {
  return (
    <div className="theme-card">
      <Image src={src} alt={alt} fill sizes="(max-width:900px) 100vw, 33vw" style={{ objectFit: "cover" }} />
      <div className="theme-card-body">
        <span className={`tag ${tagClass}`} style={{ marginBottom: "0.5rem" }}>{icon} {tag}</span>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section id="home" style={{
        minHeight: "100vh", position: "relative", display: "flex", alignItems: "center",
        background: "linear-gradient(160deg, #052e16 0%, #165a16 45%, #1a5c72 100%)",
        overflow: "hidden",
      }}>
        {/* Background image */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.22 }}>
          <Image src="/images/african-bird.jpg"
            alt="Africa wildlife" fill sizes="100vw" style={{ objectFit: "cover" }} priority />
        </div>

        {/* Doodle decorations */}
        <div style={{ position: "absolute", top: "8%", right: "6%", opacity: 0.35 }} className="anim-spin-slow">
          <TribalSun size={180} color="#e1aa05" opacity={0.6} />
        </div>
        <div style={{ position: "absolute", bottom: "12%", right: "14%", opacity: 0.3 }} className="anim-float">
          <AfricanLeaf size={120} color="#00a86b" opacity={0.8} />
        </div>
        <div style={{ position: "absolute", top: "20%", left: "3%", opacity: 0.25 }}>
          <KenteCircle size={110} color="#61c6de" opacity={0.8} />
        </div>
        <div style={{ position: "absolute", bottom: "20%", left: "8%", opacity: 0.25 }}>
          <AdinkraDiamond size={80} color="#e1aa05" opacity={0.7} />
        </div>
        <div style={{ position: "absolute", top: "55%", right: "3%", opacity: 0.2 }}>
          <TribalDots size={100} color="#4dd9a0" opacity={0.9} />
        </div>
        <div style={{ position: "absolute", top: 0, left: 0 }}>
          <CornerOrnament size={90} color="#e1aa05" opacity={0.5} />
        </div>
        {/* Tribal border strip at hero bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <TribalBorderDiamond height={36} color1="#e1aa05" color2="#69382a" color3="#00a86b" opacity={0.7} />
        </div>

        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: "8rem", paddingBottom: "5rem" }}>
          <div style={{ maxWidth: 680 }}>
            <div className="anim-fade-up" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
              <TribalWaveBorder width={80} color="#e1aa05" opacity={0.9} />
              <span style={{ fontFamily: "var(--ff-heading)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)" }}>
                A Landmark Conservation Publication
              </span>
              <TribalWaveBorder width={80} color="#e1aa05" opacity={0.9} />
            </div>

            <h1 className="anim-fade-up delay-100" style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(3rem,7vw,5.5rem)", fontWeight: 900, lineHeight: 1.05, color: "#fff", marginBottom: "0.5rem" }}>
              BOESA
            </h1>
            <h2 className="anim-fade-up delay-200" style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(1rem,2.5vw,1.5rem)", fontWeight: 400, fontStyle: "italic", color: "rgba(255,255,255,0.75)", marginBottom: "1.75rem", lineHeight: 1.4 }}>
              Biodiversity Outcomes of Eastern and Southern Africa
            </h2>
            <p className="anim-fade-up delay-300" style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 560 }}>
              An authoritative, richly illustrated compendium exploring the extraordinary natural heritage of Africa — spanning savanna ecosystems, ancient forests, and vibrant coastal seascapes.
            </p>

            <div className="anim-fade-up delay-400" style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <a href="#themes" className="btn btn-gold">Explore Themes ↓</a>
              {/* <a href="#order" className="btn btn-secondary" style={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff" }}>Order Your Copy</a> */}
            </div>

            {/* Stats */}
            <div className="anim-fade-up delay-500" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.75rem", marginTop: "3.5rem" }}>
              {STATS.map((s, i) => (
                <div key={i} className="stat-box">
                  <div className="number">{s.n}</div>
                  <div style={{ fontFamily: "var(--ff-display)", fontSize: "0.75rem", color: "var(--green-mid)", fontWeight: 600 }}>{s.unit}</div>
                  <div className="label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ ABOUT ═════════════════════════════════════════ */}
      
      <section id="about" className="section-pad" style={{ background: "var(--cream)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", right: "-2%" }}><TribalSun size={200} color="#228c22" opacity={0.08} /></div>
        <div style={{ position: "absolute", bottom: "5%", left: "-1%" }}><AdinkraDiamond size={120} color="#e1aa05" opacity={0.1} /></div>

        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <p className="section-eyebrow">About the Book</p>
            <h2 className="section-title">Africa's Nature,<br /><em>Revealed</em></h2>
            <div className="ornament-divider">
              <hr /><TribalSun size={28} color="#D4A017" opacity={0.7} /><hr />
            </div>
            <p className="section-subtitle">
              BOESA is the definitive reference work documenting biodiversity patterns, ecological dynamics, and conservation outcomes across Eastern and Southern Africa — a region that holds some of the planet's most irreplaceable natural heritage.
            </p>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginTop: "1rem", lineHeight: 1.8 }}>
              Written by leading ecologists, conservation biologists, and marine scientists, this volume synthesizes decades of field research with cutting-edge remote sensing and spatial analysis.
            </p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
              <a href="#themes" className="btn btn-primary">Explore the Book</a>
              {/* <a href="#order" className="btn btn-secondary">Buy Now</a> */}
            </div>
          </div>

          {/* Book visual */}
          <div style={{ position: "relative" }}>
            <div style={{
              borderRadius: "var(--radius-lg)", overflow: "hidden", height: 420,
              boxShadow: "0 20px 60px rgba(0,168,107,0.25)", position: "relative",
            }}>
              <Image src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80"
                alt="African landscape overview" fill sizes="(max-width:900px) 100vw, 50vw" style={{ objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,120,60,0.3), transparent)" }} />
            </div>
            <div style={{ position: "absolute", bottom: -20, right: -20 }}>
              <AfricanLeaf size={100} color="#00a86b" opacity={0.6} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ THEMES ════════════════════════════════════════ */}
    
      <section id="themes" className="section-pad" style={{ background: "linear-gradient(180deg, #f0f9f4 0%, #e6f7ee 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "0%", right: "5%" }}><KenteCircle size={160} color="#228c22" opacity={0.09} /></div>
        <div style={{ position: "absolute", bottom: "0%", left: "3%" }}><TribalDots size={120} color="#e1aa05" opacity={0.18} /></div>

        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p className="section-eyebrow">Three Core Themes</p>
            <h2 className="section-title" style={{ textAlign: "center" }}>Pillars of <em>Africa's</em> Biodiversity</h2>
            <TribalWaveBorder width={220} color="#e1aa05" opacity={0.7} className="anim-pulse" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
            <ThemeCard
              src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80"
              alt="Biodiversity wildlife"
              tag="Biodiversity" tagClass="tag--green" icon="🌿"
              title="Wildlife & Ecosystems"
              desc="From the vast Serengeti plains to the fragmented highland forests, Africa's biodiversity is unparalleled. Explore species richness, endemism hotspots, and ecological resilience."
            />
            <ThemeCard
              src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80"
              alt="Dense African forest"
              tag="Forests" tagClass="tag--gold" icon="🌳"
              title="Forest Landscapes"
              desc="Ancient Afromontane forests, coastal mangroves, and miombo woodlands are the continent's lungs. This section examines their extent, threats, and carbon significance."
            />
            <ThemeCard
              src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80"
              alt="Coral reef seascape"
              tag="Seascapes" tagClass="tag--ocean" icon="🌊"
              title="Coastal & Marine"
              desc="The Western Indian Ocean hosts extraordinary marine biodiversity — coral reefs, seagrass meadows, mangrove estuaries, and critical blue carbon ecosystems."
            />
          </div>
        </div>
      </section>

      {/* ══ BIODIVERSITY GALLERY ══════════════════════════ */}
      {/* ── Diamond border before biodiversity gallery ── */}
      <div style={{ lineHeight: 0, background: "#fff" }}>
        <TribalBorderDiamond height={40} color1="#e1aa05" color2="#69382a" color3="#228c22" opacity={0.6} />
      </div>

      <section id="gallery" className="section-pad" style={{ background: "#fff", position: "relative" }}>
        <div style={{ position: "absolute", top: "5%", left: "2%" }}><TribalSun size={140} color="#e1aa05" opacity={0.09} /></div>

        <div className="container">
          <p className="section-eyebrow">🌿 Theme One</p>
          <h2 className="section-title">Biodiversity <em>Wonders</em></h2>
          <p className="section-subtitle" style={{ marginBottom: "2rem" }}>
            Eastern and Southern Africa harbours over a third of the continent's vertebrate species, many found nowhere else on Earth.
          </p>
          <PhotoStrip items={BIODIVERSITY} height={250} />
        </div>
      </section>

      {/* ══ QUOTE ════════════════════════════════════════ */}
      {/* ── Spiral border before quote ── */}
      <div style={{ lineHeight: 0, background: "linear-gradient(135deg,#052e16,#1a5c72)" }}>
        <TribalBorderSpiral height={52} color1="#00a86b" color2="#e1aa05" color3="#61c6de" />
      </div>

      <section className="quote-section section-pad" style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.08 }}>
          <Image src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&q=60"
            alt="Forest aerial" fill sizes="100vw" style={{ objectFit: "cover" }} />
        </div>
        <div style={{ position: "absolute", top: "10%", left: "5%" }}><CornerOrnament size={70} color="#e1aa05" opacity={0.6} /></div>
        <div style={{ position: "absolute", bottom: "10%", right: "5%", transform: "rotate(180deg)" }}><CornerOrnament size={70} color="#e1aa05" opacity={0.6} /></div>
        <div style={{ position: "absolute", top: "20%", right: "8%", opacity: 0.3 }}><TribalSun size={120} color="#e1aa05" opacity={0.7} /></div>

        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <TribalSun size={48} color="#e1aa05" opacity={0.9} />
          <p className="quote-text" style={{ margin: "1.5rem auto", maxWidth: 740 }}>
            "Africa's biodiversity is not just a continental treasure — it is humanity's shared inheritance, shaped by millions of years of evolution and deeply intertwined with the livelihoods of over a billion people."
          </p>
          <TribalWaveBorder width={200} color="#e1aa05" opacity={0.7} />
          <p style={{ fontFamily: "var(--ff-heading)", fontSize: "0.85rem", color: "rgba(255,255,255,0.65)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "1rem" }}>
            — BOESA Editorial Team
          </p>
        </div>
      </section>

      {/* ══ FORESTS GALLERY ═══════════════════════════════ */}
      <section className="section-pad" style={{ background: "linear-gradient(180deg,#f0f9f0,#e4f0e8)" }}>
        <div className="container">
          <p className="section-eyebrow">🌳 Theme Two</p>
          <h2 className="section-title">Forest <em>Landscapes</em></h2>
          <p className="section-subtitle" style={{ marginBottom: "2rem" }}>
            From the Ethiopian highlands to Madagascar's rainforests — ancient forests under pressure, but resilient.
          </p>
          <PhotoStrip items={FORESTS} height={280} />
        </div>
      </section>

      {/* ══ SEASCAPES GALLERY ════════════════════════════ */}
      {/* ── Diamond border before seascapes ── */}
      <div style={{ lineHeight: 0, background: "linear-gradient(180deg,#e8f7fb,#d4eef7)" }}>
        <TribalBorderDiamond height={40} color1="#61c6de" color2="#69382a" color3="#00a86b" opacity={0.65} />
      </div>
      <section className="section-pad" style={{ background: "linear-gradient(180deg,#e8f7fb,#d4eef7)" }}>
        <div style={{ position: "absolute", right: "-2%", top: "20%" }}><KenteCircle size={140} color="#61c6de" opacity={0.1} /></div>
        <div className="container">
          <p className="section-eyebrow">🌊 Theme Three</p>
          <h2 className="section-title">Coastal <em>Seascapes</em></h2>
          <p className="section-subtitle" style={{ marginBottom: "2rem" }}>
            The Western Indian Ocean's reefs, mangroves, and blue waters sustain millions while storing vast amounts of blue carbon.
          </p>
          <PhotoStrip items={SEASCAPES} height={280} />
        </div>
      </section>

      {/* ══ ORDER CTA ════════════════════════════════════ */}
      {/* ── Spiral border before CTA ── */}
      <div style={{ lineHeight: 0, background: "linear-gradient(135deg,#052e16,#0d3344)" }}>
        <TribalBorderSpiral height={52} color1="#e1aa05" color2="#00a86b" color3="#61c6de" />
      </div>

      <section id="order" className="section-pad" style={{
        background: "linear-gradient(135deg, #052e16 0%, #0a1e0a 60%, #0d3344 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "5%", left: "5%", opacity: 0.22 }}><TribalSun size={160} color="#e1aa05" opacity={0.8} /></div>
        <div style={{ position: "absolute", bottom: "5%", right: "5%", opacity: 0.18 }}><AfricanLeaf size={130} color="#00a86b" opacity={0.9} /></div>
        <div style={{ position: "absolute", top: "30%", right: "15%", opacity: 0.12 }}><AdinkraDiamond size={90} color="#e1aa05" opacity={0.9} /></div>

        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <p style={{ fontFamily: "var(--ff-heading)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem" }}>
            Available Now
          </p>
          <h2 style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, color: "#fff", marginBottom: "1.25rem", lineHeight: 1.15 }}>
            Explore <em style={{ color: "#f5cc30" }}>BOESA</em>
          </h2>
          <TribalWaveBorder width={200} color="#e1aa05" opacity={0.7} />
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.05rem", lineHeight: 1.8, maxWidth: 520, margin: "1.5rem auto 2.5rem" }}>
            A collector's edition publication — rich photography, fold-out maps, and scientific rigour. Perfect for researchers, conservationists, and nature lovers.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#" id="order-hardcover" className="btn btn-gold" style={{ fontSize: "1rem", padding: "1rem 2.2rem" }}>
              Digital Edition →
            </a>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════ */}

      <footer style={{ background: "#071209", padding: "3rem 0 2rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: 0, right: 0, opacity: 0.1 }}><KenteCircle size={200} color="#00a86b" opacity={0.9} /></div>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "2.5rem", alignItems: "start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <TribalSun size={36} color="#e1aa05" opacity={0.95} />
              <span style={{ fontFamily: "var(--ff-display)", fontSize: "1.3rem", fontWeight: 900, color: "#fff" }}>BOESA</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", lineHeight: 1.8, maxWidth: 320 }}>
              Biodiversity Outcomes of Eastern and Southern Africa. Documenting nature's legacy for future generations.
            </p>
          </div>
          <div>
            <p style={{ fontFamily: "var(--ff-heading)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1rem" }}>Navigate</p>
            {["About", "Themes", "Gallery", "Order"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="footer-link">{l}</a>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: "var(--ff-heading)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1rem" }}>Contact</p>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.88rem", lineHeight: 1.8 }}>info@boesabook.org<br />Eastern Africa Institute<br />of Conservation Science</p>
          </div>
        </div>
        <div className="container" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: "2rem", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>© 2026 BOESA Publication. All rights reserved.</p>
          <TribalWaveBorder width={120} color="#e1aa05" opacity={0.3} />
        </div>
      </footer>
    </>
  );
}
