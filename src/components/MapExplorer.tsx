import { useEffect, useState } from "react";
import { X, Layers } from "lucide-react";
import { NavMap } from "@/components/NavMap";
import { PlaceSheet } from "@/components/PlaceSheet";
import { findNode } from "@/data/sensory";
import { ILLUSTRATIVE_ROUTE } from "@/data/geo";
import { useStore } from "@/lib/store";

/** Near-full-screen real map (MapLibre handles pan / pinch / zoom). Pins open the place sheet. */
export function MapExplorer({
  path,
  alt,
  onRoute,
  onClose,
}: {
  path: string[];
  alt?: string[] | undefined;
  onRoute: (id: string) => void;
  onClose: () => void;
}) {
  const st = useStore();
  const [pin, setPin] = useState<string | null>(st.mapView.pin);
  const [overlay, setOverlay] = useState(false);
  useEffect(() => {
    st.set({ mapView: { ...st.mapView, pin } });
  }, [pin]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pin) onClose();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [pin, onClose]);
  const node = pin ? findNode(pin) : null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Explore map"
      className="map-open fixed inset-0 z-40 mx-auto flex max-w-[430px] flex-col bg-background"
    >
      <header className="flex h-14 items-center justify-between px-5">
        <h2 className="font-display text-2xl font-bold text-primary">Explore map</h2>
        <button
          aria-label="Close map"
          onClick={onClose}
          className="grid size-11 place-items-center rounded-full hover:bg-accent"
        >
          <X className="size-6" />
        </button>
      </header>
      <div className="relative mx-3 flex-1">
        <NavMap
          path={path}
          alt={alt}
          selected={pin}
          overlay={overlay}
          onSelect={setPin}
          className="absolute inset-0 size-full"
        />
        <button
          aria-pressed={overlay}
          onClick={() => setOverlay((o) => !o)}
          className="retro absolute left-3 top-3 z-20 inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-card px-3 text-sm font-bold text-primary aria-pressed:bg-accent-lime"
        >
          <Layers className="size-4" />
          Sensory overlay
        </button>
      </div>
      <p className="px-5 py-2 text-xs text-muted-foreground">{ILLUSTRATIVE_ROUTE}</p>
      {node && (
        <PlaceSheet
          node={node}
          onRoute={() => {
            onRoute(node.id);
            setPin(null);
            onClose();
          }}
          onClose={() => setPin(null)}
        />
      )}
    </div>
  );
}
