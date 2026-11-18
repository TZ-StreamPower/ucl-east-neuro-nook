import { photoFor, sceneFor } from "@/data/images";
import type { Cat } from "@/data/demo";

export type ArtKey =
  "building" | "cafe" | "study" | "support" | "quiet" | "route" | "park" | "water" | "station";
export const artForCat = (c: Cat): ArtKey =>
  c === "food" ? "cafe" : c === "study" ? "study" : c === "support" ? "support" : "building";

const BG: Record<ArtKey, string> = {
  building: "fill-accent-lavender",
  cafe: "fill-accent-yellow",
  study: "fill-accent-blue",
  support: "fill-accent-lavender",
  quiet: "fill-[#d9cdf0]",
  route: "fill-map-green",
  park: "fill-map-green",
  water: "fill-map-water",
  station: "fill-accent-blue",
};

function Scene({ k }: { k: ArtKey }) {
  const ink = "stroke-primary";
  switch (k) {
    case "building":
      return (
        <>
          <rect x="0" y="230" width="400" height="70" className="fill-accent-lime" />
          <rect
            x="70"
            y="80"
            width="130"
            height="150"
            rx="8"
            className={`fill-card ${ink}`}
            strokeWidth="4"
          />
          <rect
            x="210"
            y="130"
            width="110"
            height="100"
            rx="8"
            className={`fill-accent-yellow ${ink}`}
            strokeWidth="4"
          />
          {[0, 1, 2].flatMap((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`${r}${c}`}
                x={90 + c * 35}
                y={100 + r * 38}
                width="22"
                height="24"
                rx="3"
                className="fill-accent-blue"
              />
            )),
          )}
          <rect x="108" y="190" width="30" height="40" rx="4" className="fill-brand" />
        </>
      );
    case "cafe":
      return (
        <>
          <rect x="0" y="240" width="400" height="60" className="fill-card" />
          <path d="M140 130h120l-12 100h-96z" className={`fill-card ${ink}`} strokeWidth="5" />
          <path d="M260 150c35 0 35 50 0 50" fill="none" className={ink} strokeWidth="6" />
          <path
            d="M175 110c-12-18 12-24 0-42M215 110c-12-18 12-24 0-42"
            fill="none"
            className="stroke-brand"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </>
      );
    case "study":
      return (
        <>
          <rect x="0" y="230" width="400" height="70" className="fill-card" />
          <rect
            x="80"
            y="170"
            width="240"
            height="18"
            rx="6"
            className={`fill-brand ${ink}`}
            strokeWidth="4"
          />
          <rect x="100" y="188" width="14" height="42" className="fill-primary" />
          <rect x="286" y="188" width="14" height="42" className="fill-primary" />
          <rect
            x="130"
            y="130"
            width="70"
            height="40"
            rx="4"
            className={`fill-accent-yellow ${ink}`}
            strokeWidth="4"
          />
          <rect
            x="210"
            y="145"
            width="60"
            height="25"
            rx="4"
            className={`fill-accent-lime ${ink}`}
            strokeWidth="4"
          />
          <path
            d="M300 170v-60l-30-14"
            fill="none"
            className={ink}
            strokeWidth="5"
            strokeLinecap="round"
          />
        </>
      );
    case "support":
      return (
        <>
          <rect x="0" y="240" width="400" height="60" className="fill-accent-lime" />
          <path
            d="M90 90h170a16 16 0 0 1 16 16v60a16 16 0 0 1-16 16H170l-40 34v-34H90a16 16 0 0 1-16-16v-60a16 16 0 0 1 16-16z"
            className={`fill-card ${ink}`}
            strokeWidth="5"
          />
          <path
            d="M175 160c-22-14-22-34-6-34 8 0 6 8 6 8s-2-8 6-8c16 0 16 20-6 34z"
            className="fill-brand"
          />
        </>
      );
    case "quiet":
      return (
        <>
          <circle cx="310" cy="80" r="34" className="fill-accent-yellow" />
          <circle cx="324" cy="72" r="30" className="fill-[#d9cdf0]" />
          <rect
            x="60"
            y="170"
            width="240"
            height="64"
            rx="22"
            className={`fill-brand ${ink}`}
            strokeWidth="5"
          />
          <rect
            x="60"
            y="140"
            width="240"
            height="46"
            rx="20"
            className={`fill-accent-lavender ${ink}`}
            strokeWidth="5"
          />
          <rect x="0" y="244" width="400" height="56" className="fill-card" opacity="0.6" />
        </>
      );
    case "route":
      return (
        <>
          <path
            d="M0 220C80 170 120 250 200 190S330 120 400 150V300H0z"
            className="fill-map-water"
            opacity="0.7"
          />
          <path
            d="M40 240C100 120 180 200 230 120S330 90 360 70"
            fill="none"
            className="stroke-brand"
            strokeWidth="9"
            strokeDasharray="4 16"
            strokeLinecap="round"
          />
          <circle cx="40" cy="240" r="14" className={`fill-accent-lime ${ink}`} strokeWidth="5" />
          <circle cx="360" cy="70" r="16" className={`fill-accent-yellow ${ink}`} strokeWidth="5" />
        </>
      );
    case "park":
      return (
        <>
          <ellipse cx="200" cy="270" rx="260" ry="60" className="fill-accent-lime" />
          <rect x="94" y="140" width="14" height="100" className="fill-primary" />
          <circle cx="101" cy="120" r="48" className={`fill-accent-lime ${ink}`} strokeWidth="5" />
          <rect x="262" y="160" width="12" height="80" className="fill-primary" />
          <circle cx="268" cy="146" r="36" className={`fill-accent-lime ${ink}`} strokeWidth="5" />
        </>
      );
    case "water":
      return (
        <>
          <path
            d="M0 160c60-30 100 30 160 0s100 30 160 0 60 10 80 0v140H0z"
            className="fill-map-water"
          />
          <path
            d="M0 210c60-30 100 30 160 0s100 30 160 0 60 10 80 0"
            fill="none"
            className="stroke-card"
            strokeWidth="6"
          />
          <rect x="0" y="262" width="400" height="38" className="fill-accent-lime" />
        </>
      );
    case "station":
      return (
        <>
          <rect x="0" y="230" width="400" height="70" className="fill-card" />
          <rect
            x="60"
            y="100"
            width="280"
            height="110"
            rx="12"
            className={`fill-accent-lavender ${ink}`}
            strokeWidth="5"
          />
          <rect x="90" y="130" width="60" height="50" rx="6" className="fill-accent-blue" />
          <rect x="170" y="130" width="60" height="50" rx="6" className="fill-accent-blue" />
          <rect x="250" y="130" width="60" height="50" rx="6" className="fill-accent-blue" />
          <rect x="40" y="226" width="320" height="10" className="fill-primary" />
        </>
      );
  }
}

const SCENE: Record<ArtKey, string> = {
  building: "atrium",
  cafe: "lunch",
  study: "classroom",
  support: "home_evening",
  quiet: "home_evening",
  route: "route",
  park: "route",
  water: "route",
  station: "route",
};
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/**
 * Card image. Order: your photo in src/assets/photos/<photoKey>, then the practice game's scene art
 * (cropped differently per key), then the built-in illustration.
 */
export function Art({
  kind,
  photoKey,
  className = "",
}: {
  kind: ArtKey;
  photoKey?: string | undefined;
  className?: string;
}) {
  const photo = photoKey ? photoFor(photoKey) : undefined;
  const src = photo ?? sceneFor(SCENE[kind]);
  if (src) {
    const h = hash(photoKey ?? kind);
    const pos = { objectPosition: `${[15, 50, 85][h % 3]}% ${[30, 60][(h >> 2) % 2]}%` };
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        style={photo ? undefined : pos}
        className={`size-full object-cover ${className}`}
      />
    );
  }
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={`size-full ${className}`}
    >
      <rect width="400" height="300" className={BG[kind]} />
      <Scene k={kind} />
    </svg>
  );
}

const AV = ["bg-accent-lavender", "bg-accent-lime", "bg-accent-yellow", "bg-accent-blue"];
/** Sticker-style initial avatar for demo authors (no real people). */
export function Avatar({ name, className = "size-8" }: { name: string; className?: string }) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (
    <span
      aria-hidden="true"
      className={`sticker grid shrink-0 place-items-center text-xs font-bold text-primary ${AV[h % AV.length]} ${className}`}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
