// Schematic isometric scenes. Decorative; text equivalents live outside.
type Kind = "home" | "station" | "segment" | "entrance" | "route";
function Building({ x, y, tone }: { x: number; y: number; tone: "lilac" | "terra" }) {
  const side = tone === "lilac" ? "#a48aa6" : "#c07a66";
  const shade = tone === "lilac" ? "#8a6f7f" : "#946a64";
  return (
    <g transform={`translate(${x} ${y})`}>
      <polygon points="0,20 40,0 80,20 40,40" fill="#f1e6cf" />
      <polygon points="0,20 40,40 40,80 0,60" fill={side} />
      <polygon points="40,40 80,20 80,60 40,80" fill={shade} />
      <polygon points="14,46 26,52 26,70 14,64" fill="#3d2b4a" />
    </g>
  );
}
function Tree({ x, y }: { x: number; y: number }) {
  return <polygon points={`${x},${y} ${x + 8},${y + 24} ${x - 8},${y + 24}`} fill="#5f7a63" />;
}
export function Scene({ kind, className = "" }: { kind: Kind; className?: string }) {
  return (
    <svg viewBox="0 0 300 200" className={`w-full rounded-xl bg-sand ${className}`} aria-hidden="true">
      <polygon points="0,130 180,40 300,100 300,200 0,200" fill="#b9c6a2" />
      <polygon points="0,170 200,70 260,100 60,200 0,200" fill="#f4e7cb" />
      <Tree x={40} y={110} /><Tree x={240} y={120} /><Tree x={210} y={140} />
      {kind === "route" ? (
        <>
          <Building x={50} y={50} tone="lilac" />
          <Building x={190} y={70} tone="terra" />
          <polyline points="70,140 140,95 215,135" fill="none" stroke="#361A54" strokeWidth="4" />
          {[[70,140],[140,95],[215,135]].map(([cx,cy]) => <circle key={cx} cx={cx} cy={cy} r="7" fill="#361A54" stroke="#fff" strokeWidth="2" />)}
        </>
      ) : (
        <>
          <Building x={110} y={50} tone={kind === "entrance" || kind === "home" ? "terra" : "lilac"} />
          {kind !== "home" && <circle cx="150" cy="150" r="7" fill="#361A54" stroke="#fff" strokeWidth="2" />}
          {kind === "segment" && <path d="M150 150 L205 122" stroke="#361A54" strokeWidth="4" strokeDasharray="6 6" />}
        </>
      )}
    </svg>
  );
}
