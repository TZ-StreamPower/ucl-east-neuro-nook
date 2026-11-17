import { useState } from "react";
import { Bookmark, Share2, Check } from "lucide-react";
import { pill } from "./Shell";
import { useStore } from "@/lib/store";
import { isSaved, toggleSaved, type SavedRef } from "@/lib/logic";
export function SaveShare({ item }: { item: SavedRef }) {
  const s = useStore(); const on = isSaved(s.saved, item); const [msg, setMsg] = useState("");
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button aria-pressed={on} onClick={() => { s.set({ saved: toggleSaved(s.saved, item) }); setMsg(on ? "Removed from Saved" : "Saved"); }} className={`${pill} press transition-colors duration-[var(--dur-select)] ${on ? "bg-accent-lavender" : ""}`}>
        <Bookmark key={String(on)} className={`size-4 ${on ? "pop fill-current" : ""}`} />{on ? "Saved" : "Save"}</button>
      <button className={pill} onClick={async () => { try { await navigator.clipboard.writeText(window.location.href.split("?")[0]!); setMsg("Link copied"); } catch { setMsg("Copy the address bar to share"); } }}>
        <Share2 className="size-4" />Share</button>
      <span role="status" className="text-sm font-bold text-primary">{msg && <span key={msg} className="fade-in inline-flex items-center gap-1"><Check className="size-4" aria-hidden="true" />{msg}</span>}</span>
    </div>
  );
}
