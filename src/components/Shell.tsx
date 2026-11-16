import { Link } from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

export function Heading({ children, display }: { children: ReactNode; display?: boolean }) {
  const r = useRef<HTMLHeadingElement>(null);
  useEffect(() => { r.current?.focus(); }, []);
  return <h1 ref={r} tabIndex={-1} className={`text-[1.6rem] leading-tight font-bold text-primary outline-none ${display ? "font-display" : ""}`}>{children}</h1>;
}

export function Shell({ back, backLabel, title, tabs, practice, children, footer }: {
  back?: string; backLabel?: string; title?: string; tabs?: boolean; practice?: boolean; children: ReactNode; footer?: ReactNode;
}) {
  return (
    <div className={`mx-auto flex min-h-screen max-w-[430px] flex-col ${practice ? "bg-practice" : "bg-background"} shadow-sm`}>
      <header className="mx-5 flex h-14 items-center border-b border-border">
        {back ? (
          <Link to={back} className="-ml-2 inline-flex min-h-11 items-center gap-1 px-2 font-bold text-primary"><ChevronLeft className="size-4" />{backLabel}</Link>
        ) : <span className="font-bold text-primary">{title ?? "UCL East"}</span>}
      </header>
      <main className="flex flex-1 flex-col gap-4 px-5 py-5">{children}</main>
      {footer && <div className="px-5 pb-5">{footer}</div>}
      {tabs && <Tabs />}
    </div>
  );
}

function Tabs() {
  const items = [{ to: "/", l: "Campus" }, { to: "/community", l: "Community" }, { to: "/saved", l: "Saved" }] as const;
  return (
    <nav aria-label="Main" className="sticky bottom-0 mx-5 grid grid-cols-3 border-t border-border bg-background">
      {items.map((i) => (
        <Link key={i.to} to={i.to} activeOptions={{ exact: true }} className="flex min-h-14 items-center justify-center text-sm font-bold text-primary data-[status=active]:border-t-[3px] data-[status=active]:border-brand">{i.l}</Link>
      ))}
    </nav>
  );
}

export const primaryBtn = "inline-flex min-h-12 w-full items-center justify-between rounded-lg bg-primary px-4 font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-40";
export const secondaryBtn = "inline-flex min-h-11 w-full items-center justify-between rounded-lg border border-border px-4 font-bold text-primary hover:bg-accent";
export const textLink = "inline-flex min-h-11 items-center gap-1 font-bold text-primary underline-offset-4 hover:underline";
