import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Check, Volume1, SunDim, Users, Smile, type LucideIcon } from "lucide-react";
import { Shell, Heading, backCls, primaryBtn, secondaryBtn } from "@/components/Shell";
import { FEEDBACK, findNode } from "@/data/sensory";
import { ROUTE_NODES } from "@/data/geo";
import type { Post } from "@/data/demo";
import { mergeRating, tagsFromRating, type FeedbackKind, type MyRating } from "@/lib/logic";
import { useStore } from "@/lib/store";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/reflect")({
  validateSearch: zodValidator(
    z.object({
      from: fallback(z.string(), "stratford").default("stratford"),
      to: fallback(z.string(), "marshgate").default("marshgate"),
      mode: fallback(z.string(), "calm").default("calm"),
    }),
  ),
  head: pageHead(
    "Reflect · UCL East Community",
    "Rate how a walk felt: noise, light, crowding and comfort.",
  ),
  component: Reflect,
});

type Opt = { label: string; patch: MyRating; src?: FeedbackKind; Icon?: LucideIcon };
type Group = { key: keyof MyRating; title: string; opts: Opt[] };
const asset = (k: FeedbackKind) => k;
const GROUPS: Group[] = [
  {
    key: "noise",
    title: "Noise",
    opts: [
      { label: "Quiet", patch: { noise: 1 }, src: asset("quiet") },
      { label: "Some noise", patch: { noise: 3 }, Icon: Volume1 },
      { label: "Loud", patch: { noise: 5 }, src: asset("loud") },
    ],
  },
  {
    key: "light",
    title: "Lighting",
    opts: [
      { label: "Dim", patch: { light: "dark" }, src: asset("dark") },
      { label: "Soft", patch: { light: "ok" }, Icon: SunDim },
      { label: "Bright", patch: { light: "bright" }, src: asset("bright") },
    ],
  },
  {
    key: "busy",
    title: "Crowding",
    opts: [
      { label: "Not busy", patch: { busy: "free" }, Icon: Users },
      { label: "Busy", patch: { busy: "busy" }, Icon: Users },
      { label: "Crowded", patch: { busy: "full" }, src: asset("crowded") },
    ],
  },
  {
    key: "calm",
    title: "How I felt",
    opts: [
      { label: "Overwhelmed", patch: { calm: 1 }, src: asset("overwhelming") },
      { label: "Okay", patch: { calm: 3 }, Icon: Smile },
      { label: "Calm", patch: { calm: 5 }, src: asset("calm") },
    ],
  },
];

function Reflect() {
  const sp = Route.useSearch();
  const st = useStore();
  const from = findNode(sp.from) ?? findNode("stratford")!;
  const to = findNode(sp.to) ?? findNode("marshgate")!;
  const [picks, setPicks] = useState<MyRating>({});
  const [note, setNote] = useState("");
  const [share, setShare] = useState(false);
  const [done, setDone] = useState<{ shared: string | null } | null>(null);
  const count = Object.keys(picks).length;
  const back = (
    <Link
      to="/navigate"
      search={{ from: from.id, to: to.id, mode: sp.mode === "quick" ? "quick" : "calm" }}
      className={backCls}
    >
      <ChevronLeft className="size-4" />
      Navigate
    </Link>
  );
  const choose = (g: Group, o: Opt) =>
    setPicks((p) => {
      const same = p[g.key] === o.patch[g.key];
      const { [g.key]: _drop, ...rest } = p;
      return same ? rest : { ...rest, ...o.patch };
    });

  const save = () => {
    st.set({ ratings: { ...st.ratings, [to.id]: mergeRating(st.ratings[to.id], picks) } });
    let shared: string | null = null;
    if (share) {
      const routeId = Object.entries(ROUTE_NODES).find(
        ([, v]) => v.from === from.id && v.to === to.id,
      )?.[0];
      const tags = tagsFromRating(picks);
      const id = `x-${Date.now()}`;
      const post: Post = {
        id,
        kind: "Experience",
        title: note.trim() || `Walk to ${to.name}`,
        ...(to.placeId ? { placeId: to.placeId } : {}),
        ...(routeId ? { routeId } : {}),
        art: to.placeId ? "building" : "park",
        ...(tags.length ? { tags } : {}),
        author: "You",
        replies: [],
      };
      st.set({ experiences: [...st.experiences, post] });
      shared = id;
    }
    setDone({ shared });
  };

  if (done) {
    return (
      <Shell back={back}>
        <div role="status" className="retro space-y-2 rounded-2xl bg-accent-lime p-4">
          <p className="flex items-center gap-2 font-display text-2xl font-bold text-primary">
            <Check className="size-6" /> Saved
          </p>
          <p>Your answers now count towards {to.name} on this device.</p>
        </div>
        {done.shared && (
          <Link to="/community" className={primaryBtn}>
            See it in Community
          </Link>
        )}
        <Link to="/" className={secondaryBtn}>
          Back to Explore
        </Link>
      </Shell>
    );
  }
  return (
    <Shell back={back}>
      <Heading display>How was your walk?</Heading>
      <p className="-mt-2 text-sm text-muted-foreground">
        {from.name} → {to.name}. Answer any of these; each one is separate. Saved on this device.
      </p>
      {GROUPS.map((g) => (
        <section key={g.key} aria-label={g.title} className="space-y-2">
          <h2 className="font-bold text-primary">{g.title}</h2>
          <div className="grid grid-cols-3 gap-2">
            {g.opts.map((o) => {
              const on = picks[g.key] !== undefined && picks[g.key] === o.patch[g.key];
              const img = o.src ? FEEDBACK.find((f) => f.k === o.src)!.src : undefined;
              return (
                <button
                  key={o.label}
                  aria-pressed={on}
                  onClick={() => choose(g, o)}
                  className={`retro press flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl p-2 text-xs font-bold text-primary ${on ? "bg-accent-lavender ring-4 ring-brand" : "bg-card"}`}
                >
                  {img ? (
                    <img src={img} alt="" className="size-12" />
                  ) : (
                    o.Icon && <o.Icon className="size-8" aria-hidden="true" />
                  )}
                  {o.label}
                </button>
              );
            })}
          </div>
        </section>
      ))}
      <label className="space-y-1 text-sm font-bold text-primary">
        Short note (optional)
        <input
          value={note}
          maxLength={120}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What would help someone else?"
          className="min-h-12 w-full retro rounded-xl bg-card px-3 font-normal text-foreground outline-none"
        />
      </label>
      <label className="flex min-h-12 items-center gap-3 font-bold text-primary">
        <input
          type="checkbox"
          role="switch"
          checked={share}
          onChange={(e) => setShare(e.target.checked)}
          className="size-6 accent-[var(--brand)]"
        />
        Also share as a Community experience
      </label>
      <button className={primaryBtn} disabled={count === 0} onClick={save}>
        {share ? "Save and share" : "Save"} <Check className="size-4" />
      </button>
      <p className="text-xs text-muted-foreground">
        Prototype: saved in this browser only. Nothing is sent to a server or shown to other people.
      </p>
    </Shell>
  );
}
