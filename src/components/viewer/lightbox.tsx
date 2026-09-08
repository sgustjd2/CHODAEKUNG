"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<{ images?: string[]; index?: number }>).detail;
      if (d?.images?.length) setState({ images: d.images, i: d.index ?? 0 });
    };
    window.addEventListener(LIGHTBOX_EVENT, onOpen);
    return () => window.removeEventListener(LIGHTBOX_EVENT, onOpen);
  }, []);

  const step = (n: number) => setState((s) => (s ? { ...s, i: (s.i + n + s.images.length) % s.images.length } : s));

  useEffect(() => {
    if (!state || typeof document === "undefined") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setState(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // lock background scroll while open
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!state || typeof document === "undefined") return null;
  const { images, i } = state;
  const multi = images.length > 1;
  return createPortal(
    <div className="iv-lightbox" role="dialog" aria-modal="true" onClick={() => setState(null)}>
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
