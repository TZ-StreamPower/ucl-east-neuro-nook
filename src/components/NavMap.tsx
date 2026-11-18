import { useMemo } from "react";
import { GeoMap, toneOf, type GeoMarker, type GeoLine } from "@/components/GeoMap";
import { NODES, findNode } from "@/data/sensory";
import { GEO, llPath, kindOf } from "@/data/geo";
import { useStore } from "@/lib/store";

/** East Bank map wired to the navigation graph: markers carry the shared node ids and sensory tone. */
export function NavMap({
  path,
  alt,
  selected,
  current,
  walking,
  overlay,
  onSelect,
  className,
  focusId,
}: {
  path: string[];
  alt?: string[] | undefined;
  selected?: string | null | undefined;
  current?: string | null | undefined;
  walking?: boolean | undefined;
  overlay?: boolean | undefined;
  onSelect: (id: string) => void;
  className?: string | undefined;
  focusId?: string | null | undefined;
}) {
  const st = useStore();
  const markers = useMemo<GeoMarker[]>(
    () =>
      NODES.map((n) => {
        const s = st.sensory(n.id);
        const state =
          n.id === current
            ? "current"
            : n.id === selected
              ? "selected"
              : path.includes(n.id)
                ? "path"
                : "normal";
        return {
          id: n.id,
          name: n.name,
          ll: GEO[n.id]!.ll,
          tone: toneOf(s.calm),
          calm: s.calm,
          state,
          approx: !!GEO[n.id]!.approx,
          xy: n.xy,
          kind: kindOf(n.id),
          label: path.includes(n.id) && (path[0] === n.id || path[path.length - 1] === n.id),
        } satisfies GeoMarker;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [path.join(">"), selected, current, st.ratings],
  );
  const lines = useMemo<GeoLine[]>(() => {
    const xy = (p: string[]) => p.map((id) => findNode(id)!.xy);
    const out: GeoLine[] = [];
    if (alt && alt.length > 1)
      out.push({ id: "alt", kind: "quick", coords: llPath(alt), xy: xy(alt) });
    if (path.length > 1)
      out.push({ id: "main", kind: walking ? "walk" : "calm", coords: llPath(path), xy: xy(path) });
    return out;
  }, [path.join(">"), alt?.join(">"), walking]); // eslint-disable-line react-hooks/exhaustive-deps
  const focus = focusId && GEO[focusId] ? GEO[focusId]!.ll : null;
  return (
    <GeoMap
      markers={markers}
      lines={lines}
      fit={llPath([...path, ...(alt ?? [])])}
      fitKey={`${path.join(">")}|${alt?.join(">") ?? ""}`}
      focus={focus}
      {...(overlay !== undefined ? { overlay } : {})}
      onSelect={onSelect}
      {...(className ? { className } : {})}
    />
  );
}
