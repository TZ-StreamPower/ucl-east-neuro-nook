import { Link } from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";
import { Compass, MessageCircle, Bookmark, X, Settings, WifiOff } from "lucide-react";
import { useStore } from "@/lib/store";

export function Heading({ children, display }: { children: ReactNode; display?: boolean }) {
  const r = useRef<HTMLHeadingElement>(null);
  useEffect(() => { r.current?.focus(); }, []);
  return <h1 ref={r} tabIndex={-1} className={`text-[1.6rem] leading-tight font-bold text-primary outline-none ${display ? "font-display" : ""}`}>{children}</h1>;
}

export function Shell({ back, title, tabs, practice, children, footer }: {
  back?: ReactNode; title?: string; tabs?: boolean; practice?: boolean; children: ReactNode; footer?: ReactNode;
}) {
  const { offline } = useStore();
  return (
    <div className={`mx-auto flex min-h-screen max-w-[430px] flex-col ${practice ? "bg-practice" : "bg-background"} shadow-sm`}>
      <header className="mx-5 flex h-14 items-center border-b border-border">
        {back ?? <span className="font-bold text-primary">{title ?? "UCL East"}</span>}
        {tabs && <Link to="/settings" aria-label="Preferences" className="ml-auto grid size-11 place-items-center rounded-full text-primary hover:bg-accent"><Settings className="size-5" /></Link>}
      </header>
      {offline && <p role="status" className="mx-5 mt-3 flex items-center gap-2 rounded-lg bg-accent p-2 text-sm font-bold text-primary"><WifiOff className="size-4" />Offline (simulated) · only saved items are available</p>}
      <main className="flex flex-1 flex-col gap-4 px-5 py-5">{children}</main>
      {footer && <div className="sticky bottom-0 bg-background/95 px-5 py-3">{footer}</div>}
      {tabs && <Tabs />}
    </div>
  );
}

function Tabs() {
  const items = [{ to: "/", l: "Campus", I: Compass }, { to: "/community", l: "Community", I: MessageCircle }, { to: "/saved", l: "Saved", I: Bookmark }] as const;
  return (
    <nav aria-label="Main" className="pb-safe sticky bottom-0 grid grid-cols-3 border-t-2 border-primary bg-background px-5">
      {items.map(({ to, l, I }) => (
        <Link key={to} to={to} activeOptions={{ exact: to === "/" }} className="group flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-bold text-muted-foreground data-[status=active]:text-primary">
          <span className="grid h-7 w-12 place-items-center rounded-full group-data-[status=active]:sticker group-data-[status=active]:bg-accent-lavender"><I className="size-5" /></span>{l}
        </Link>
      ))}
    </nav>
  );
}

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null); const cb = useRef(onClose); cb.current = onClose;
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null; closeRef.current?.focus();
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") cb.current(); };
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); prev?.focus?.(); };
  }, []);
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-foreground/30" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="sheet-t" onClick={(e) => e.stopPropagation()} className="max-h-[85vh] w-full max-w-[430px] space-y-3 overflow-y-auto rounded-t-2xl bg-background p-5">
        <div className="mx-auto h-1 w-10 rounded-full bg-border" aria-hidden="true" />
        <div className="flex items-center justify-between gap-2">
          <h2 id="sheet-t" className="text-lg font-bold text-primary">{title}</h2>
          <button ref={closeRef} aria-label="Close" onClick={onClose} className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-accent"><X className="size-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const backCls = "-ml-2 inline-flex min-h-11 items-center gap-1 px-2 font-bold text-primary";
export const primaryBtn = "inline-flex min-h-12 w-full items-center justify-between retro rounded-lg bg-primary px-4 font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-40";
export const secondaryBtn = "inline-flex min-h-11 w-full items-center justify-between retro rounded-lg bg-background px-4 font-bold text-primary hover:bg-accent";
export const textLink = "inline-flex min-h-11 items-center gap-1 font-bold text-primary underline-offset-4 hover:underline";
export const pill = "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-bold text-primary hover:bg-accent aria-pressed:border-brand aria-pressed:text-brand";
