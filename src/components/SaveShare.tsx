import { useState } from "react";
import { Bookmark, Share2 } from "lucide-react";
import { pill } from "./Shell";
import { useStore } from "@/lib/store";
import { isSaved, toggleSaved, type SavedRef } from "@/lib/logic";
export function SaveShare({ item }: { item: SavedRef }) {
  const s = useStore(); const on = isSaved(s.saved, item); const [msg, setMsg] = useState("");
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button aria-pressed={on} onClick={() => { s.set({ saved: toggleSaved(s.saved, item) }); setMsg(on ? "Removed from Saved" : "Saved"); }} className={pill}>
        <Bookmark className={`size-4 ${on ? "fill-current" : ""}`} />{on ? "Saved" : "Save"}</button>
      <button className={pill} onClick={async () => { try { await navigator.clipboard.writeText(window.location.href.split("?")[0]!); setMsg("Link copied"); } catch { setMsg("Copy the address bar to share"); } }}>
        <Share2 className="size-4" />Share</button>
      <span role="status" className="text-sm text-muted-foreground">{msg}</span>
    </div>
  );
}
