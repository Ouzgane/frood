import { scoreLabel } from "../lib/score";

export function ScoreDot({ total }: { total: number }) {
  const { label, color } = scoreLabel(total);
  return (
    <span className="score-dot" title={label}>
      <span className="dot" style={{ background: color }} />
      <strong>{total}</strong>
      <span className="score-dot-label">/100</span>
    </span>
  );
}

export function ScoreCircle({ total }: { total: number }) {
  const { label, color } = scoreLabel(total);
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="score-circle">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="var(--line)" strokeWidth="8" />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(total / 100) * c} ${c}`}
          transform="rotate(-90 44 44)"
        />
        <text x="44" y="49" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--ink)">
          {total}
        </text>
      </svg>
      <span className="score-circle-label" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
