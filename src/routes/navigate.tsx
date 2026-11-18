import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Footprints,
  Leaf,
  Zap,
  Coffee,
  MessageSquareHeart,
  Flag,
  MapPin as PinIcon,
  Maximize2,
  Layers,
} from "lucide-react";
import { Shell, Sheet, primaryBtn, secondaryBtn } from "@/components/Shell";
import { MapExplorer } from "@/components/MapExplorer";
import { NavMap } from "@/components/NavMap";
import { PlaceSheet } from "@/components/PlaceSheet";
import { MiniMeter, calmTone } from "@/components/SensoryMeter";
import { FeedbackTray } from "@/components/FeedbackTray";
import { NODES, GRAPH, FEEDBACK, findNode } from "@/data/sensory";
import { ILLUSTRATIVE_ROUTE } from "@/data/geo";
import { planRoute, nearestCalm, applyFeedback, routeStats, type FeedbackKind } from "@/lib/logic";
import { useStore } from "@/lib/store";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/navigate")({
  validateSearch: zodValidator(
    z.object({
      from: fallback(z.string(), "stratford").default("stratford"),
      to: fallback(z.string(), "marshgate").default("marshgate"),
      mode: fallback(z.string(), "calm").default("calm"),
      walk: fallback(z.number(), 0).default(0),
      step: fallback(z.number(), 0).default(0),
    }),
  ),
  head: pageHead(
    "Navigate · UCL East Community",
    "Find the calmest way between Stratford, UCL East, Here East, V&A East and the DLR.",
  ),
  component: Navigate,
});

const sel = "min-h-12 w-full retro rounded-xl bg-card px-3 font-bold text-primary";

function Navigate() {
  const raw = Route.useSearch();
  const nav = useNavigate({ from: "/navigate" });
  const st = useStore();
  const from = findNode(raw.from)?.id ?? "stratford";
  const to = findNode(raw.to)?.id ?? "marshgate";
  const mode = raw.mode === "quick" ? "quick" : "calm";
  const upd = (p: Partial<typeof raw>) =>
    nav({ search: (x) => ({ ...x, ...p }), replace: true, resetScroll: false });

  const calmPlan = useMemo(
    () => planRoute(GRAPH, from, to, "calm", st.sensory),
    [from, to, st.ratings],
  );
  const quickPlan = useMemo(
    () => planRoute(GRAPH, from, to, "quick", st.sensory),
    [from, to, st.ratings],
  );
  const plan = mode === "calm" ? calmPlan : quickPlan;
  const other = mode === "calm" ? quickPlan : calmPlan;
  const path = plan?.path ?? [from];
  const walking = raw.walk === 1;
  const step = Math.min(Math.max(raw.step, 0), path.length - 1);
  const here = findNode(path[step]!)!;
  const arrived = walking && step === path.length - 1;

  const [tray, setTray] = useState(false);
  const [brk, setBrk] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState<string | null>(null);
  const [peek, setPeek] = useState<string | null>(null);
  const [overlay, setOverlay] = useState(false);

  const give = (k: FeedbackKind) => {
    st.set({
      ratings: { ...st.ratings, [here.id]: applyFeedback(st.ratings[here.id], k) },
      walkFb: [...st.walkFb, { id: here.id, k }],
    });
    setSaved(FEEDBACK.find((f) => f.k === k)!.label);
  };
  const breakId = nearestCalm(GRAPH, here.id, st.sensory);
  const breakNode = breakId ? findNode(breakId) : null;
  useEffect(() => {
    if (st.mapView.from !== from || st.mapView.to !== to || st.mapView.mode !== mode)
      st.set({ mapView: { ...st.mapView, from, to, mode } });
  }, [from, to, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const pinNode = pin ? findNode(pin) : null;
  const finish = () => {
    upd({ walk: 0, step: 0 });
    nav({ to: "/reflect", search: { from, to, mode } });
  };

  const cards = [
    { m: "calm" as const, label: "Calmest", I: Leaf, p: calmPlan },
    { m: "quick" as const, label: "Quickest", I: Zap, p: quickPlan },
  ];

  return (
    <Shell tabs>
      {!walking && (
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Navigate</h1>
          <p className="text-muted-foreground">Find the calm way across East Bank.</p>
        </div>
      )}
      {!walking && (
        <div className="grid grid-cols-2 gap-2">
          <label className="space-y-1 text-xs font-bold text-muted-foreground">
            From
            <select
              aria-label="From"
              className={sel}
              value={from}
              onChange={(e) => upd({ from: e.target.value, step: 0 })}
            >
              {NODES.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-xs font-bold text-muted-foreground">
            To
            <select
              aria-label="To"
              className={sel}
              value={to}
              onChange={(e) => upd({ to: e.target.value, step: 0 })}
            >
              {NODES.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </label>
          <div role="group" aria-label="Route type" className="col-span-2 grid grid-cols-2 gap-2">
            {cards.map(({ m, label, I, p }) => {
              const s = p ? routeStats(p.path, st.sensory) : null;
              return (
                <button
                  key={m}
                  aria-pressed={mode === m}
                  onClick={() => upd({ mode: m })}
                  className={`retro press flex min-h-20 flex-col items-start gap-0.5 rounded-xl p-3 text-left font-bold ${mode === m ? "bg-primary text-primary-foreground" : "bg-card text-primary"}`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <I className="size-5" />
                    {label}
                  </span>
                  <span className="font-display text-xl">{p ? `${p.minutes} min` : "—"}</span>
                  {s && (
                    <span className="text-xs font-normal opacity-90">
                      {s.loud} loud · {s.crowded} crowded stop{s.crowded === 1 ? "" : "s"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="relative">
        <NavMap
          path={path}
          alt={!walking ? other?.path : undefined}
          selected={pin}
          current={walking ? here.id : null}
          walking={walking}
          overlay={overlay}
          focusId={walking ? here.id : peek}
          onSelect={setPin}
          className={walking ? "aspect-square" : "aspect-[4/5]"}
        />
        <button
          aria-label="Expand map"
          onClick={() => setOpen(true)}
          className="retro absolute right-3 top-3 z-20 grid size-11 place-items-center rounded-xl bg-card text-primary"
        >
          <Maximize2 className="size-5" />
        </button>
        <button
          aria-pressed={overlay}
          onClick={() => setOverlay((o) => !o)}
          className="retro absolute left-3 top-3 z-20 inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-card px-3 text-sm font-bold text-primary aria-pressed:bg-accent-lime"
        >
          <Layers className="size-4" />
          Sensory overlay
        </button>
      </div>
      {!walking && (
        <>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-primary">
            <Key cls="bg-accent-lime" l="Calm" />
            <Key cls="bg-accent-yellow" l="Mixed" />
            <Key cls="bg-terracotta/40" l="Overwhelming" />
            <span className="inline-flex items-center gap-1">
              <span className="h-0 w-5 border-t-4 border-brand" />
              Chosen
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-0 w-5 border-t-4 border-dashed border-muted-foreground" />
              Alternative
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {ILLUSTRATIVE_ROUTE}. Dashed pin edge = approximate position.
          </p>
        </>
      )}
      {open && (
        <MapExplorer
          path={path}
          alt={other?.path}
          onRoute={(id) => upd({ to: id, step: 0, walk: 0 })}
          onClose={() => setOpen(false)}
        />
      )}
      {pinNode && !open && (
        <PlaceSheet
          node={pinNode}
          onRoute={() => {
            upd({ to: pinNode.id, step: 0, walk: 0 });
            setPin(null);
          }}
          onClose={() => setPin(null)}
        />
      )}

      {!plan ? (
        <p className="rounded-xl bg-accent p-4 font-bold text-primary">
          No path between these places.
        </p>
      ) : !walking ? (
        <>
          <p className="font-display text-xl font-bold text-primary">
            {plan.minutes} min · {path.length - 1} {path.length === 2 ? "stage" : "stages"}
          </p>
          <ol className="space-y-2" aria-label="Checkpoints">
            {path.map((id, i) => {
              const n = findNode(id)!;
              return (
                <li key={id}>
                  <button
                    onClick={() => setPeek(id)}
                    aria-label={`Show ${n.name} on the map`}
                    className={`retro press flex w-full items-start gap-3 rounded-xl bg-card p-3 text-left ${peek === id ? "ring-2 ring-brand" : ""}`}
                  >
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-full border-2 border-primary text-sm font-bold text-primary ${calmTone(st.sensory(id))}`}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-bold text-primary">{n.name}</span>
                      <MiniMeter s={st.sensory(id)} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <button
            className={primaryBtn}
            disabled={path.length < 2}
            onClick={() => upd({ walk: 1, step: 0 })}
          >
            Start walk <Footprints className="size-5" />
          </button>
        </>
      ) : (
        <>
          <section
            aria-live="polite"
            className={`retro space-y-2 rounded-2xl p-4 ${arrived ? "bg-accent-lime" : "bg-card"}`}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {arrived ? "You have arrived" : `Stage ${step + 1} of ${path.length}`}
            </p>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-primary">
              {arrived ? <Flag className="size-6" /> : <PinIcon className="size-6" />}
              {here.name}
            </h2>
            <p>{here.cue}</p>
            <MiniMeter s={st.sensory(here.id)} />
            {saved && (
              <p role="status" className="text-sm font-bold text-brand">
                Saved: {saved}
              </p>
            )}
          </section>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTray(true)}
              className="retro press flex min-h-20 flex-col items-center justify-center gap-1 rounded-2xl bg-accent-lavender font-bold text-primary"
            >
              <MessageSquareHeart className="size-6" />
              How is it here?
            </button>
            <button
              onClick={() => setBrk(true)}
              className="retro press flex min-h-20 flex-col items-center justify-center gap-1 rounded-2xl bg-accent-blue font-bold text-primary"
            >
              <Coffee className="size-6" />I need a break
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              className={secondaryBtn}
              onClick={() => (step === 0 ? upd({ walk: 0 }) : upd({ step: step - 1 }))}
            >
              <ArrowLeft className="size-4" />
              {step === 0 ? "Exit" : "Back"}
            </button>
            {arrived ? (
              <button className={primaryBtn} onClick={finish}>
                Finish <Flag className="size-4" />
              </button>
            ) : (
              <button
                className={primaryBtn}
                onClick={() => {
                  setSaved(null);
                  upd({ step: step + 1 });
                }}
              >
                Next <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </>
      )}
      {tray && <FeedbackTray place={here.name} onPick={give} onClose={() => setTray(false)} />}
      {brk && (
        <Sheet title="Take a break" onClose={() => setBrk(false)}>
          {breakNode ? (
            <>
              <div className="retro rounded-xl bg-accent-lime p-3">
                <p className="font-bold text-primary">{breakNode.name}</p>
                <p className="text-sm">{breakNode.cue}</p>
                <MiniMeter s={st.sensory(breakNode.id)} />
              </div>
              <button
                className={primaryBtn}
                onClick={() => {
                  setBrk(false);
                  upd({ from: here.id, to: breakNode.id, mode: "calm", step: 0, walk: 1 });
                }}
              >
                Go there <ArrowRight className="size-4" />
              </button>
            </>
          ) : (
            <p>No calmer spot nearby. Pause here as long as you need.</p>
          )}
          <button className={secondaryBtn} onClick={() => setBrk(false)}>
            Stay here
          </button>
        </Sheet>
      )}
    </Shell>
  );
}
function Key({ cls, l }: { cls: string; l: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`size-3 rounded-full border-2 border-primary ${cls}`} />
      {l}
    </span>
  );
}
