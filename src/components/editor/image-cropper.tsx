"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Minimal, dependency-free image cropper (CLAUDE.md §5 "ImageCropper shell"). A fixed-aspect frame
 * with the image panned/zoomed behind it (drag + zoom slider), exported to a JPEG File on 적용.
 * No Genspark reference exists, so this is the §15 fallback: neutral, tokenized, keyboard/touch-safe.
 *
 * Coordinate model: `pos` is the image's top-left offset (px) within the frame at the current display
 * scale (= coverScale × zoom). The image always covers the frame, so pos is clamped to [frame−disp, 0].
 */
export function ImageCropper({
  file,
  aspect = 3 / 4,
  onCancel,
  onCropped,
}: {
  file: File;
  /** width / height of the crop frame + output (default portrait 3:4, suits covers). */
  aspect?: number;
  onCancel: () => void;
  onCropped: (file: File) => void;
}) {
  const [url, setUrl] = useState("");
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [frame, setFrame] = useState({ w: 0, h: 0 });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  // Load the selected file as an <img> (and object URL for display).
  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    const im = new Image();
    im.onload = () => setImg(im);
    im.onerror = () => setErr("이미지를 읽을 수 없어요.");
    im.src = u;
    return () => URL.revokeObjectURL(u);
  }, [file]);

  // Track the frame's rendered size (responsive: desktop modal vs mobile full-width).
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => setFrame({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [url]);

  const coverScale = img && frame.w ? Math.max(frame.w / img.naturalWidth, frame.h / img.naturalHeight) : 1;
  const dispScale = coverScale * zoom;
  const dispW = img ? img.naturalWidth * dispScale : 0;
  const dispH = img ? img.naturalHeight * dispScale : 0;
  const clamp = (p: { x: number; y: number }) => ({
    x: Math.min(0, Math.max(frame.w - dispW, p.x)),
    y: Math.min(0, Math.max(frame.h - dispH, p.y)),
  });

  // Center on first layout, and keep the image covering the frame as zoom/size change.
  const centered = useRef(false);
  useEffect(() => {
    if (!img || !frame.w) return;
    if (!centered.current) {
      centered.current = true;
      setPos(clamp({ x: (frame.w - dispW) / 2, y: (frame.h - dispH) / 2 }));
    } else {
      setPos((p) => clamp(p));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img, frame.w, frame.h, zoom]);

  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setPos(clamp({ x: drag.current.px + (e.clientX - drag.current.x), y: drag.current.py + (e.clientY - drag.current.y) }));
  };
  const onUp = (e: React.PointerEvent) => {
    drag.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const apply = () => {
    if (!img || !frame.w) return;
    setBusy(true);
    try {
      const outW = Math.min(1600, Math.round(frame.w * 2));
      const outH = Math.round(outW / aspect);
      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no ctx");
      // Frame → source-pixel region (inverse of display scale/offset).
      ctx.drawImage(img, -pos.x / dispScale, -pos.y / dispScale, frame.w / dispScale, frame.h / dispScale, 0, 0, outW, outH);
      canvas.toBlob(
        (blob) => {
          setBusy(false);
          if (!blob) return setErr("크롭에 실패했어요.");
          const base = file.name.replace(/\.[^.]+$/, "") || "image";
          onCropped(new File([blob], `${base}.jpg`, { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.9,
      );
    } catch {
      setBusy(false);
      setErr("크롭에 실패했어요.");
    }
  };

  return (
    <div className="ic-overlay" role="dialog" aria-modal="true" aria-label="사진 자르기" onPointerDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="ic-modal">
        <div className="ic-head">
          <span>사진 자르기</span>
          <button type="button" aria-label="닫기" onClick={onCancel}>✕</button>
        </div>
        <div
          className="ic-frame"
          ref={frameRef}
          style={{ aspectRatio: String(aspect) }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {url && <img className="ic-img" src={url} alt="" draggable={false} style={{ width: dispW || undefined, height: dispH || undefined, transform: `translate(${pos.x}px, ${pos.y}px)` }} />}
          <div className="ic-grid" aria-hidden="true" />
        </div>
        <div className="ic-zoom">
          <span>확대</span>
          <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(+e.target.value)} aria-label="확대" />
        </div>
        {err && <div className="ic-err">{err}</div>}
        <div className="ic-actions">
          <button type="button" className="ic-btn" onClick={onCancel}>취소</button>
          <button type="button" className="ic-btn ic-primary" onClick={apply} disabled={busy || !img}>{busy ? "처리 중…" : "적용"}</button>
        </div>
      </div>
    </div>
  );
}
