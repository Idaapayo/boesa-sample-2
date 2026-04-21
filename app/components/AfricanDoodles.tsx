import React from "react";

// ─── Tribal Sun / Radial Pattern ───────────────────────────────────────────
export function TribalSun({
  size = 120,
  color = "#D4A017",
  opacity = 0.18,
  className = "",
}: {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="60" cy="60" r="18" fill={color} fillOpacity={opacity * 2} />
      <circle cx="60" cy="60" r="28" stroke={color} strokeWidth="2" strokeOpacity={opacity} strokeDasharray="4 3" />
      <circle cx="60" cy="60" r="42" stroke={color} strokeWidth="1.5" strokeOpacity={opacity * 0.7} />
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16;
        const rad = (angle * Math.PI) / 180;
        const r = (v: number) => Math.round(v * 1000) / 1000;
        const x1 = r(60 + 30 * Math.cos(rad));
        const y1 = r(60 + 30 * Math.sin(rad));
        const x2 = r(60 + 55 * Math.cos(rad));
        const y2 = r(60 + 55 * Math.sin(rad));
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={i % 2 === 0 ? "2" : "1"}
            strokeOpacity={opacity}
          />
        );
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8 + 22.5;
        const rad = (angle * Math.PI) / 180;
        const r = (v: number) => Math.round(v * 1000) / 1000;
        const cx = r(60 + 48 * Math.cos(rad));
        const cy = r(60 + 48 * Math.sin(rad));
        return (
          <circle key={i} cx={cx} cy={cy} r="3" fill={color} fillOpacity={opacity * 1.5} />
        );
      })}
    </svg>
  );
}

// ─── Adinkra Diamond ────────────────────────────────────────────────────────
export function AdinkraDiamond({
  size = 80,
  color = "#2D6A4F",
  opacity = 0.2,
  className = "",
}: {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <polygon points="40,4 76,40 40,76 4,40" stroke={color} strokeWidth="2" strokeOpacity={opacity} fill="none" />
      <polygon points="40,16 64,40 40,64 16,40" stroke={color} strokeWidth="1.5" strokeOpacity={opacity} fill={color} fillOpacity={opacity * 0.3} />
      <polygon points="40,28 52,40 40,52 28,40" fill={color} fillOpacity={opacity * 0.6} />
      <line x1="4" y1="40" x2="76" y2="40" stroke={color} strokeWidth="1" strokeOpacity={opacity * 0.5} />
      <line x1="40" y1="4" x2="40" y2="76" stroke={color} strokeWidth="1" strokeOpacity={opacity * 0.5} />
    </svg>
  );
}

// ─── African Leaf / Leaf Spiral ──────────────────────────────────────────────
export function AfricanLeaf({
  size = 100,
  color = "#52B788",
  opacity = 0.2,
  className = "",
}: {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M50 90 C20 70, 5 40, 50 10 C95 40, 80 70, 50 90Z"
        fill={color}
        fillOpacity={opacity * 0.5}
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity={opacity}
      />
      <line x1="50" y1="90" x2="50" y2="10" stroke={color} strokeWidth="1.5" strokeOpacity={opacity} />
      {[20, 32, 44, 56, 68].map((y, i) => {
        const spread = i < 2 ? 8 + i * 6 : 20 - (i - 2) * 6;
        return (
          <g key={i}>
            <line x1="50" y1={y} x2={50 - spread} y2={y + 8} stroke={color} strokeWidth="1" strokeOpacity={opacity} />
            <line x1="50" y1={y} x2={50 + spread} y2={y + 8} stroke={color} strokeWidth="1" strokeOpacity={opacity} />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Tribal Circle / Kente Pattern ──────────────────────────────────────────
export function KenteCircle({
  size = 100,
  color = "#1B4965",
  opacity = 0.15,
  className = "",
}: {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="2" strokeOpacity={opacity} />
      <circle cx="50" cy="50" r="36" stroke={color} strokeWidth="1" strokeOpacity={opacity * 0.7} strokeDasharray="6 3" />
      <circle cx="50" cy="50" r="24" fill={color} fillOpacity={opacity * 0.3} />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const r = (v: number) => Math.round(v * 1000) / 1000;
        const x1 = r(50 + 25 * Math.cos(angle));
        const y1 = r(50 + 25 * Math.sin(angle));
        const x2 = r(50 + 44 * Math.cos(angle));
        const y2 = r(50 + 44 * Math.sin(angle));
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={i % 3 === 0 ? "2" : "1"} strokeOpacity={opacity} />
        );
      })}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * 60 * Math.PI) / 180;
        const r = (v: number) => Math.round(v * 1000) / 1000;
        const cx = r(50 + 36 * Math.cos(angle));
        const cy = r(50 + 36 * Math.sin(angle));
        return <circle key={i} cx={cx} cy={cy} r="3" fill={color} fillOpacity={opacity * 1.5} />;
      })}
    </svg>
  );
}

// ─── Tribal Wave Border ──────────────────────────────────────────────────────
export function TribalWaveBorder({
  width = 300,
  color = "#D4A017",
  opacity = 0.25,
  className = "",
}: {
  width?: number;
  color?: string;
  opacity?: number;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={24}
      viewBox={`0 0 ${width} 24`}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {Array.from({ length: Math.floor(width / 20) }).map((_, i) => (
        <g key={i} transform={`translate(${i * 20}, 0)`}>
          <path
            d="M0,12 C3,4 7,4 10,12 C13,20 17,20 20,12"
            stroke={color}
            strokeWidth="1.5"
            strokeOpacity={opacity}
            fill="none"
          />
          <circle cx="10" cy="12" r="1.5" fill={color} fillOpacity={opacity * 1.2} />
        </g>
      ))}
    </svg>
  );
}

// ─── Scattered Dots Tribal Pattern ──────────────────────────────────────────
export function TribalDots({
  size = 80,
  color = "#52B788",
  opacity = 0.2,
  className = "",
}: {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
}) {
  const dots = [
    { cx: 15, cy: 15, r: 4 }, { cx: 40, cy: 8, r: 2.5 }, { cx: 65, cy: 15, r: 4 },
    { cx: 8, cy: 40, r: 2.5 }, { cx: 30, cy: 30, r: 5 }, { cx: 50, cy: 25, r: 3 },
    { cx: 72, cy: 40, r: 2.5 }, { cx: 20, cy: 55, r: 3 }, { cx: 45, cy: 50, r: 6 },
    { cx: 65, cy: 60, r: 3 }, { cx: 15, cy: 65, r: 2.5 }, { cx: 38, cy: 70, r: 3.5 },
    { cx: 60, cy: 72, r: 2.5 }, { cx: 25, cy: 80, r: 4 }, { cx: 55, cy: 80, r: 2 },
  ];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 88"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={color} fillOpacity={opacity * (0.8 + (i % 3) * 0.3)} />
      ))}
    </svg>
  );
}

// ─── Corner Ornament ─────────────────────────────────────────────────────────
export function CornerOrnament({
  size = 60,
  color = "#D4A017",
  opacity = 0.3,
  className = "",
}: {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M4,4 L56,4 L56,8 L8,8 L8,56 L4,56 Z" fill={color} fillOpacity={opacity} />
      <path d="M12,12 C12,12 28,12 28,28" stroke={color} strokeWidth="2" strokeOpacity={opacity} fill="none" />
      <circle cx="12" cy="12" r="4" fill={color} fillOpacity={opacity * 1.2} />
      <circle cx="28" cy="12" r="2" fill={color} fillOpacity={opacity} />
      <circle cx="12" cy="28" r="2" fill={color} fillOpacity={opacity} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={20 + i * 8} cy={4 + i * 0} r="1.5" fill={color} fillOpacity={opacity * 0.8} />
      ))}
    </svg>
  );
}
