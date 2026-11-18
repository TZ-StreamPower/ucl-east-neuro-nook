import { useEffect, useRef, useState } from "react";
import type { Map as MLMap, Marker as MLMarker, GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { EastBankMap } from "@/components/scenes/EastBankMap";
import { MAP_CENTER, MAP_STYLE } from "@/data/geo";

export type Tone = "calm" | "mixed" | "over";
export type GeoMarker = {
  id: string;
  name: string;
  ll: [number, number];
  tone: Tone;
  calm: number;
  state?: "current" | "path" | "selected" | "normal";
  approx?: boolean;
  xy?: [number, number];
  label?: boolean;
  kind?: "station" | "building" | "green" | "water";
};
export type GeoLine = {
  id: string;
  kind: "calm" | "quick" | "walk";
  coords: [number, number][];
  xy?: [number, number][];
};

const TONE: Record<Tone, string> = {
  calm: "bg-accent-lime",
  mixed: "bg-accent-yellow",
  over: "bg-terracotta/40",
};
export const toneOf = (calm: number): Tone => (calm >= 4 ? "calm" : calm >= 3 ? "mixed" : "over");
const BRAND = "#7a2fe0";
const INK = "#321747";
const GREY = "#6b6475";
const ICON: Record<NonNullable<GeoMarker["kind"]>, string> = {
  station:
    '<path d="M4.5 2.5h7a1 1 0 0 1 1 1v6.5h-9V3.5a1 1 0 0 1 1-1zM3.5 10l-1.5 3M12.5 10l1.5 3M5.5 6h5"/>',
  building: '<path d="M3 14V2.5h6.5V14M9.5 6.5H13V14M5.2 5h2.2M5.2 7.6h2.2M5.2 10.2h2.2"/>',
  green: '<circle cx="8" cy="6" r="3.6"/><path d="M8 9.6V14M6 14h4"/>',
  water: '<path d="M1.5 6.5c2-2 3.5 2 6.5 0s4.5 2 6.5 0M1.5 11c2-2 3.5 2 6.5 0s4.5 2 6.5 0"/>',
};

function paint(el: HTMLElement, m: GeoMarker) {
  const dot = el.children[0] as HTMLElement;
  const lab = el.children[1] as HTMLElement;
  const big = m.state === "selected" || m.state === "current";
  const size = big ? "size-9 ring-4 ring-brand" : m.state === "path" ? "size-7" : "size-6";
  dot.className = `grid place-items-center rounded-full border-2 border-primary text-primary ${m.approx ? "border-dashed" : ""} ${TONE[m.tone]} ${size} transition-all`;
  dot.innerHTML = m.kind
    ? `<svg viewBox="0 0 16 16" width="${big ? 20 : 14}" height="${big ? 20 : 14}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[m.kind]}</svg>`
    : "";
  el.setAttribute("aria-pressed", String(m.state === "selected"));
  lab.style.display = m.label || big ? "block" : "none";
}
function markerEl(m: GeoMarker) {
  const el = document.createElement("button");
  el.type = "button";
  el.setAttribute("aria-label", m.name + (m.approx ? " (approximate position)" : ""));
  el.className = "geo-pin grid size-11 place-items-center";
  el.appendChild(document.createElement("span"));
  const lab = document.createElement("span");
  lab.className = "geo-pin-label";
  lab.textContent = m.name;
  el.appendChild(lab);
  paint(el, m);
  return el;
}

/**
 * Real OpenStreetMap-based map (MapLibre + OpenFreeMap vector tiles: buildings, paths, water, stations).
 * Falls back to the schematic East Bank drawing when WebGL or the tiles are unavailable (e.g. offline).
 * Routes are straight segments between verified node positions: illustrative, not turn-by-turn.
 */
export function GeoMap({
  markers,
  lines,
  fit,
  fitKey,
  focus,
  overlay,
  onSelect,
  className = "aspect-[4/5]",
  controls = true,
}: {
  markers: GeoMarker[];
  lines: GeoLine[];
  fit?: [number, number][];
  fitKey?: string;
  focus?: [number, number] | null;
  overlay?: boolean;
  onSelect?: (id: string) => void;
  className?: string;
  controls?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const pins = useRef(new Map<string, MLMarker>());
  const lib = useRef<typeof import("maplibre-gl") | null>(null);
  const sel = useRef(onSelect);
  sel.current = onSelect;
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const latest = useRef({ markers, lines, fit, fitKey, overlay });
  latest.current = { markers, lines, fit, fitKey, overlay };
  const fitted = useRef<string | undefined>(undefined);

  const sync = () => {
    const m = map.current;
    const L = lib.current;
    if (!m || !L || !m.getSource("geo-lines")) return;
    const c = latest.current;
    (m.getSource("geo-lines") as GeoJSONSource).setData({
      type: "FeatureCollection",
      features: c.lines.map((l) => ({
        type: "Feature",
        properties: { kind: l.kind },
        geometry: { type: "LineString", coordinates: l.coords },
      })),
    });
    (m.getSource("geo-sensory") as GeoJSONSource).setData({
      type: "FeatureCollection",
      features: c.markers.map((k) => ({
        type: "Feature",
        properties: { calm: k.calm },
        geometry: { type: "Point", coordinates: k.ll },
      })),
    });
    (m.getSource("geo-landmarks") as GeoJSONSource).setData({
      type: "FeatureCollection",
      features: c.markers.map((k) => ({
        type: "Feature",
        properties: {
          name: k.name,
          lbl: k.label || k.state === "selected" || k.state === "current" ? 1 : 0,
        },
        geometry: { type: "Point", coordinates: k.ll },
      })),
    });
    m.setLayoutProperty("geo-sensory", "visibility", c.overlay ? "visible" : "none");
    const ids = new Set(c.markers.map((k) => k.id));
    for (const [id, p] of pins.current) {
      if (!ids.has(id)) {
        p.remove();
        pins.current.delete(id);
      }
    }
    for (const k of c.markers) {
      const have = pins.current.get(k.id);
      if (have) {
        have.setLngLat(k.ll);
        paint(have.getElement(), k);
        continue;
      }
      const el = markerEl(k);
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        sel.current?.(k.id);
      });
      pins.current.set(k.id, new L.Marker({ element: el }).setLngLat(k.ll).addTo(m));
    }
    if (c.fit?.length && fitted.current !== c.fitKey) {
      fitted.current = c.fitKey;
      const b = new L.LngLatBounds(c.fit[0]!, c.fit[0]!);
      c.fit.forEach((p) => b.extend(p));
      m.fitBounds(b, { padding: 56, maxZoom: 17, duration: 0 });
    }
  };

  useEffect(() => {
    let dead = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    (async () => {
      try {
        const L = await import("maplibre-gl");
        // Vite pre-bundling moves the library, so give MapLibre an explicit, bundled worker URL.
        const { default: workerUrl } =
          await import("maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url");
        L.setWorkerUrl(workerUrl);
        if (dead || !box.current) return;
        lib.current = L;
        const m = new L.Map({
          container: box.current,
          style: MAP_STYLE,
          center: MAP_CENTER,
          zoom: 14.2,
          attributionControl: { compact: true },
        });
        map.current = m;
        if (controls) m.addControl(new L.NavigationControl({ showCompass: false }), "bottom-right");
        timer = setTimeout(() => {
          if (!dead && !m.getSource("geo-lines")) setStatus("fallback");
        }, 10000);
        m.on("error", (e) => {
          const msg = String(e.error?.message ?? "");
          if (!dead && !m.getSource("geo-lines") && /style|fetch|network|tiles/i.test(msg)) {
            setStatus("fallback");
          }
        });
        m.on("load", () => {
          const paintOf = (id: string, prop: string, v: unknown) => {
            if (m.getLayer(id)) m.setPaintProperty(id, prop as never, v as never);
          };
          // Calm, high-contrast basemap: lavender buildings, clear pedestrian paths, blue water, soft parks.
          paintOf("building", "fill-color", "#e3d8f6");
          paintOf("building", "fill-outline-color", "#a98fdc");
          paintOf("park", "fill-color", "#d3ecc0");
          paintOf("water", "fill-color", "#b6dbf6");
          paintOf("waterway_river", "line-color", "#8fc4ee");
          for (const id of ["road_path_pedestrian", "bridge_path_pedestrian"]) {
            paintOf(id, "line-color", "#b9a6e6");
            paintOf(id, "line-width", [
              "interpolate",
              ["exponential", 1.2],
              ["zoom"],
              14,
              1.8,
              20,
              12,
            ]);
          }
          if (m.getLayer("building-3d")) m.setLayoutProperty("building-3d", "visibility", "none"); // flat footprints read more clearly
          m.addSource("geo-landmarks", {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
          });
          m.addLayer({
            id: "geo-landmarks",
            type: "symbol",
            source: "geo-landmarks",
            minzoom: 13,
            filter: ["==", ["get", "lbl"], 0],
            layout: {
              "text-field": ["get", "name"],
              "text-font": ["Noto Sans Bold"],
              "text-size": 11,
              "text-anchor": "top",
              "text-offset": [0, 1.5],
              "text-max-width": 8,
            },
            paint: { "text-color": INK, "text-halo-color": "#ffffff", "text-halo-width": 1.6 },
          });
          m.addSource("geo-lines", {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
          });
          m.addSource("geo-sensory", {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
          });
          m.addLayer({
            id: "geo-sensory",
            type: "circle",
            source: "geo-sensory",
            layout: { visibility: "none" },
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 13, 22, 17, 70],
              "circle-blur": 0.6,
              "circle-opacity": 0.55,
              "circle-color": ["step", ["get", "calm"], "#d2694b", 3, "#f2cf4a", 4, "#9ed36a"],
            },
          });
          m.addLayer({
            id: "geo-line-casing",
            type: "line",
            source: "geo-lines",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: { "line-color": "#ffffff", "line-width": 9, "line-opacity": 0.9 },
          });
          m.addLayer({
            id: "geo-line-quick",
            type: "line",
            source: "geo-lines",
            filter: ["==", ["get", "kind"], "quick"],
            paint: { "line-color": GREY, "line-width": 4, "line-dasharray": [1.5, 1.5] },
          });
          m.addLayer({
            id: "geo-line-calm",
            type: "line",
            source: "geo-lines",
            filter: ["in", ["get", "kind"], ["literal", ["calm", "walk"]]],
            layout: { "line-cap": "round", "line-join": "round" },
            paint: { "line-color": BRAND, "line-width": 5 },
          });
          m.addLayer({
            id: "geo-line-halo",
            type: "line",
            source: "geo-lines",
            filter: ["==", ["get", "kind"], "walk"],
            paint: { "line-color": INK, "line-width": 1.5, "line-gap-width": 5 },
          });
          clearTimeout(timer);
          // Keep the required attribution, but start collapsed behind the (i) button.
          m.once("idle", () => {
            const a = m.getContainer().querySelector(".maplibregl-ctrl-attrib");
            a?.classList.remove("maplibregl-compact-show");
            a?.removeAttribute("open");
          });
          if (import.meta.env.DEV) {
            const w = window as unknown as Record<string, unknown>;
            w["__geoMap"] = m;
            w["__geoRefit"] = () => {
              fitted.current = undefined;
              sync();
            };
          }
          setStatus("ready");
          sync();
        });
      } catch {
        if (!dead) setStatus("fallback");
      }
    })();
    return () => {
      dead = true;
      clearTimeout(timer);
      pins.current.clear();
      map.current?.remove();
      map.current = null;
      lib.current = null;
      fitted.current = undefined;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    sync();
  }, [markers, lines, overlay, fitKey]);
  useEffect(() => {
    if (focus && status === "ready") map.current?.easeTo({ center: focus, duration: 500 });
  }, [focus, status]);

  if (status === "fallback") {
    return (
      <div data-map-state="fallback">
        <EastBankMap
          {...(lines.find((l) => l.kind !== "quick")?.xy
            ? { line: lines.find((l) => l.kind !== "quick")!.xy! }
            : {})}
          className={className}
        >
          {markers
            .filter((m) => m.xy)
            .map((m) => (
              <button
                key={m.id}
                aria-label={m.name}
                aria-pressed={m.state === "selected"}
                onClick={() => onSelect?.(m.id)}
                style={{ left: `${m.xy![0]}%`, top: `${m.xy![1]}%` }}
                className="absolute z-10 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
              >
                <span
                  className={`rounded-full border-2 border-primary ${TONE[m.tone]} ${m.state === "selected" || m.state === "current" ? "size-9 ring-4 ring-brand" : "size-5"}`}
                />
              </button>
            ))}
        </EastBankMap>
        <p className="mt-1 text-xs text-muted-foreground">
          Street map unavailable offline — showing a schematic.
        </p>
      </div>
    );
  }
  return (
    <div
      className={`geo-map retro relative w-full overflow-hidden rounded-2xl bg-map ${className}`}
      data-map-state={status}
    >
      <div ref={box} className="size-full" />
      {status === "loading" && (
        <p
          role="status"
          className="absolute inset-0 z-10 grid place-items-center bg-map/80 text-sm font-bold text-primary"
        >
          Loading map…
        </p>
      )}
    </div>
  );
}
