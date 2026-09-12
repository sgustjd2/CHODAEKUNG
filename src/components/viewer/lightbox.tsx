"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** Tap a gallery photo → full-screen viewer with prev/next. Galleries dispatch this event with
 * their resolved image srcs + the tapped index; a single LightboxRoot (in InvitationViewer) shows it. */
export const LIGHTBOX_EVENT = "chodaekung:lightbox";

export function openLightbox(images: string[], index: number) {
  if (typeof window === "undefined" || images.length === 0) return;
  window.dispatchEvent(new CustomEvent(LIGHTBOX_EVENT, { detail: { images, index } }));
}

export function LightboxRoot() {
  const [state, setState] = useState<{ images: string[]; i: number } | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<{ images?: string[]; index?: number }>).detail;
      if (d?.images?.length) {
        triggerRef.current = (document.activeElement as HTMLElement) ?? null;
        setState({ images: d.images, i: d.index ?? 0 });
      }
    };
    window.addEventListener(LIGHTBOX_EVENT, onOpen);
    return () => window.removeEventListener(LIGHTBOX_EVENT, onOpen);
  }, []);

  const step = (n: number) => setState((s) => (s ? { ...s, i: (s.i + n + s.images.length) % s.images.length } : s));

  // Open/close lifecycle (keyed on open, NOT the image index — so navigating doesn't re-run it):
  // lock background scroll, move focus into the dialog, trap Tab (aria-modal promises it), handle
  // Escape + arrows, and return focus to the gallery thumbnail that opened it. (CLAUDE.md §10)
  const open = state !== null;
  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setState(null); return; }
      if (e.key === "ArrowRight") { step(1); return; }
      if (e.key === "ArrowLeft") { step(-1); return; }
      if (e.key !== "Tab") return;
      const dlg = dialogRef.current;
      if (!dlg) return;
      const nodes = Array.from(dlg.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!dlg.contains(active)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // lock background scroll while open
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus(); // move focus into the dialog
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      triggerRef.current?.focus?.(); // restore focus to the thumbnail that opened it
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!state || typeof document === "undefined") return null;
  const { images, i } = state;
  const multi = images.length > 1;
  return createPortal(
    <div className="iv-lightbox" role="dialog" aria-modal="true" aria-label="사진 크게 보기" ref={dialogRef} onClick={() => setState(null)}>
      <button className="iv-lb-btn iv-lb-close" aria-label="닫기" onClick={() => setState(null)}>×</button>
      {multi && (
        <button className="iv-lb-btn iv-lb-nav prev" aria-label="이전 사진" onClick={(e) => { e.stopPropagation(); step(-1); }}>‹</button>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="iv-lb-img" src={images[i]} alt="" onClick={(e) => e.stopPropagation()} />
      {multi && (
        <button className="iv-lb-btn iv-lb-nav next" aria-label="다음 사진" onClick={(e) => { e.stopPropagation(); step(1); }}>›</button>
      )}
      {multi && <div className="iv-lb-count">{i + 1} / {images.length}</div>}
    </div>,
    document.body,
  );
}
