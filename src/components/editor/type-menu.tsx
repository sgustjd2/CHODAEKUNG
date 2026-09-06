"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/icon";
import { metaFor } from "./editor-shared";
import type { SectionType } from "@/lib/invitation/types";

/**
 * On-brand section type-change dropdown (replaces a native <select> so the popup
 * matches the rest of the editor). Portalled to <body> with fixed positioning so
 * it never clips inside the scrollable section list, and flips up near the bottom.
 * The trigger is the section name itself — no chevron (the row's move buttons own that).
 */
export function TypeMenu({
  current,
  options,
  onChange,
  triggerClassName,
}: {
  current: SectionType;
  options: SectionType[];
  onChange: (t: SectionType) => void;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const estH = Math.min(options.length * 38 + 12, 320);
      // Open below; flip above if short on room; then clamp fully into the viewport.
      let top = r.bottom + 4;
      if (top + estH > window.innerHeight - 8) top = r.top - estH - 4;
      top = Math.max(8, Math.min(top, window.innerHeight - estH - 8));
      const left = Math.max(8, Math.min(r.left, window.innerWidth - 176));
      setPos({ top, left });
    }
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={triggerClassName}
        title="섹션 종류 변경"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
      >
        {metaFor(current).label}
      </button>
      {open &&
        pos &&
        createPortal(
          <>
            <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 200 }} />
            <div className="type-menu" role="listbox" style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 201 }}>
              {options.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="option"
                  aria-selected={t === current}
                  className={`type-menu-item${t === current ? " active" : ""}`}
                  onClick={() => {
                    onChange(t);
                    setOpen(false);
                  }}
                >
                  <Icon name={metaFor(t).icon} width={16} height={16} style={{ flexShrink: 0 }} />
                  {metaFor(t).label}
                </button>
              ))}
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
