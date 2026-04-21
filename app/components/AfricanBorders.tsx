"use client";

/**
 * Three reusable African tribal border/line SVG components
 * inspired by traditional East/Southern African textile patterns.
 *
 * ① TribalBorderDiamond  — repeating diamond-eye motifs (row 5 in reference)
 * ② TribalBorderSpiral   — spiral suns with wavy connecting lines (row 2 in reference)
 * ③ TribalBorderGeometric — cross-hatch X shapes with dot fills (row 7 in reference)
 */

/* ─────────────────────────────────────────────────────────────────────────
   ① Diamond-Eye Border
   Diamond outline + inner eye pupil, repeated across full width
   ──────────────────────────────────────────────────────────────────────── */
export function TribalBorderDiamond({
  width = 1200,
  height = 40,
  color1 = "#e1aa05",
  color2 = "#69382a",
  color3 = "#00a86b",
  opacity = 1,
  className = "",
}: {
  width?: number;
  height?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  opacity?: number;
  className?: string;
}) {
  const unit = 60; // width of one repeating motif
  const count = Math.ceil(width / unit) + 1;
  const cy = height / 2;
  const dh = height * 0.38; // half-height of diamond

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ opacity }}
    >
      {/* baseline rule above */}
      <line x1="0" y1="3" x2={width} y2="3" stroke={color2} strokeWidth="1.5" />
      {/* baseline rule below */}
      <line x1="0" y1={height - 3} x2={width} y2={height - 3} stroke={color2} strokeWidth="1.5" />

      {Array.from({ length: count }).map((_, i) => {
        const cx = i * unit + unit / 2;
        // outer diamond
        const pts = `${cx},${cy - dh} ${cx + unit * 0.38},${cy} ${cx},${cy + dh} ${cx - unit * 0.38},${cy}`;
        // inner diamond (eye shape)
        const ipts = `${cx},${cy - dh * 0.45} ${cx + unit * 0.2},${cy} ${cx},${cy + dh * 0.45} ${cx - unit * 0.2},${cy}`;
        return (
          <g key={i}>
            {/* outer diamond */}
            <polygon points={pts} stroke={color1} strokeWidth="1.8" fill={color3} fillOpacity={0.1} />
            {/* inner eye outline */}
            <polygon points={ipts} stroke={color2} strokeWidth="1.2" fill="none" />
            {/* pupil dot */}
            <circle cx={cx} cy={cy} r={dh * 0.18} fill={color2} />
            {/* small corner dots between diamonds */}
            <circle cx={cx - unit * 0.48} cy={cy} r="2" fill={color1} />
          </g>
        );
      })}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ② Spiral-Sun + Wave Border
   Alternating spiral suns joined by hand-drawn wavy lines
   ──────────────────────────────────────────────────────────────────────── */
export function TribalBorderSpiral({
  width = 1200,
  height = 48,
  color1 = "#228c22",
  color2 = "#e1aa05",
  color3 = "#61c6de",
  opacity = 1,
  className = "",
}: {
  width?: number;
  height?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  opacity?: number;
  className?: string;
}) {
  const unit = 80;
  const count = Math.ceil(width / unit) + 1;
  const cy = height / 2;
  const sr = height * 0.28; // sun radius

  // Archimedes spiral path (2 turns) for a given center
  function spiralPath(ox: number, oy: number, r: number): string {
    const turns = 2;
    const steps = 48;
    let d = `M ${ox} ${oy}`;
    for (let s = 1; s <= steps; s++) {
      const t = (s / steps) * turns * 2 * Math.PI;
      const rad = (r * s) / steps;
      const x = Math.round((ox + rad * Math.cos(t - Math.PI / 2)) * 100) / 100;
      const y = Math.round((oy + rad * Math.sin(t - Math.PI / 2)) * 100) / 100;
      d += ` L ${x} ${y}`;
    }
    return d;
  }

  // wave segment between two sun positions
  function wavePath(x1: number, x2: number, y: number, amp: number): string {
    const mid = (x1 + x2) / 2;
    return `M ${x1},${y} C ${x1 + (mid - x1) * 0.3},${y - amp} ${mid - (mid - x1) * 0.1},${y + amp} ${mid},${y} C ${mid + (x2 - mid) * 0.1},${y - amp} ${x2 - (x2 - mid) * 0.3},${y + amp} ${x2},${y}`;
  }

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ opacity }}
    >
      {/* top & bottom rules */}
      <line x1="0" y1="2" x2={width} y2="2" stroke={color1} strokeWidth="2" />
      <line x1="0" y1={height - 2} x2={width} y2={height - 2} stroke={color1} strokeWidth="2" />

      {Array.from({ length: count }).map((_, i) => {
        const cx = i * unit + unit / 2;
        // Wave between this sun and next
        const nextCx = cx + unit;
        const waveY1 = cy - sr * 0.2;
        const waveY2 = cy + sr * 0.2;
        return (
          <g key={i}>
            {/* outer spiky sun ring */}
            {Array.from({ length: 8 }).map((__, k) => {
              const ang = (k * 45 * Math.PI) / 180;
              const x2 = Math.round((cx + sr * 1.4 * Math.cos(ang)) * 100) / 100;
              const y2 = Math.round((cy + sr * 1.4 * Math.sin(ang)) * 100) / 100;
              return (
                <line key={k} x1={Math.round((cx + sr * 0.7 * Math.cos(ang)) * 100) / 100} y1={Math.round((cy + sr * 0.7 * Math.sin(ang)) * 100) / 100} x2={x2} y2={y2} stroke={color2} strokeWidth="1.2" strokeLinecap="round" />
              );
            })}
            {/* outer circle */}
            <circle cx={cx} cy={cy} r={sr * 0.68} stroke={color2} strokeWidth="1" />
            {/* spiral */}
            <path d={spiralPath(cx, cy, sr * 0.55)} stroke={color1} strokeWidth="1.3" strokeLinecap="round" />
            {/* waves between suns (two parallel) */}
            <path d={wavePath(cx + sr * 1.5, nextCx - sr * 1.5, waveY1, sr * 0.55)} stroke={color3} strokeWidth="1.4" strokeLinecap="round" />
            <path d={wavePath(cx + sr * 1.5, nextCx - sr * 1.5, waveY2, sr * 0.55)} stroke={color2} strokeWidth="1" strokeLinecap="round" strokeDasharray="3 2" />
          </g>
        );
      })}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ③ Cross-Hatch X Geometric Border
   Bold X shapes with filled square centres + dot accents between each unit
   ──────────────────────────────────────────────────────────────────────── */
export function TribalBorderGeometric({
  width = 1200,
  height = 44,
  color1 = "#00a86b",
  color2 = "#e1aa05",
  color3 = "#69382a",
  opacity = 1,
  className = "",
}: {
  width?: number;
  height?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  opacity?: number;
  className?: string;
}) {
  const unit = 52;
  const count = Math.ceil(width / unit) + 1;
  const cy = height / 2;
  const arm = height * 0.36; // half-arm length

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ opacity }}
    >
      {/* thick outer rules */}
      <line x1="0" y1="2.5" x2={width} y2="2.5" stroke={color3} strokeWidth="3" />
      <line x1="0" y1={height - 2.5} x2={width} y2={height - 2.5} stroke={color3} strokeWidth="3" />
      {/* thin inner rules */}
      <line x1="0" y1="7" x2={width} y2="7" stroke={color2} strokeWidth="1" />
      <line x1="0" y1={height - 7} x2={width} y2={height - 7} stroke={color2} strokeWidth="1" />

      {Array.from({ length: count }).map((_, i) => {
        const cx = i * unit + unit / 2;
        // X strokes
        const x1a = cx - arm * 0.75; const y1a = cy - arm;
        const x2a = cx + arm * 0.75; const y2a = cy + arm;
        const x1b = cx + arm * 0.75; const y1b = cy - arm;
        const x2b = cx - arm * 0.75; const y2b = cy + arm;
        // diamond accent between X units
        const gapX = cx + unit / 2;
        return (
          <g key={i}>
            {/* X shape — thick stroke */}
            <line x1={x1a} y1={y1a} x2={x2a} y2={y2a} stroke={color1} strokeWidth="3.5" strokeLinecap="round" />
            <line x1={x1b} y1={y1b} x2={x2b} y2={y2b} stroke={color1} strokeWidth="3.5" strokeLinecap="round" />
            {/* X outline for depth */}
            <line x1={x1a} y1={y1a} x2={x2a} y2={y2a} stroke={color3} strokeWidth="1" strokeLinecap="round" />
            <line x1={x1b} y1={y1b} x2={x2b} y2={y2b} stroke={color3} strokeWidth="1" strokeLinecap="round" />
            {/* centre square */}
            <rect x={cx - arm * 0.22} y={cy - arm * 0.22} width={arm * 0.44} height={arm * 0.44} fill={color2} rx="1" transform={`rotate(45 ${cx} ${cy})`} />
            {/* dot accent between motifs */}
            <circle cx={gapX} cy={cy} r="3.5" fill={color2} />
            <circle cx={gapX} cy={cy - arm * 0.55} r="1.8" fill={color3} />
            <circle cx={gapX} cy={cy + arm * 0.55} r="1.8" fill={color3} />
          </g>
        );
      })}
    </svg>
  );
}
