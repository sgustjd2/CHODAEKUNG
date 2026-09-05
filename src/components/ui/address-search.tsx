"use client";

import { useState } from "react";

/**
 * Korean address finder (Daum/Kakao Postcode) — free, no API key.
 * Opens the standard 주소 검색 popup and returns the selected road address
 * (with building name when available). A map pin would need a paid map key;
 * this covers "주소 찾아서 등록".
 */
const SDK = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

type Postcode = { open: () => void };
type PostcodeData = { roadAddress?: string; jibunAddress?: string; address?: string; buildingName?: string };
type DaumNS = { Postcode: new (opts: { oncomplete: (d: PostcodeData) => void }) => Postcode };

let loader: Promise<DaumNS | null> | null = null;
function loadPostcode(): Promise<DaumNS | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  const w = window as unknown as { daum?: DaumNS };
  if (w.daum?.Postcode) return Promise.resolve(w.daum);
  if (loader) return loader;
  loader = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = SDK;
    s.async = true;
    s.onload = () => resolve((window as unknown as { daum?: DaumNS }).daum ?? null);
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
  return loader;
}

export function AddressSearch({ onSelect, label = "주소 찾기", className }: { onSelect: (address: string) => void; label?: string; className?: string }) {
  const [busy, setBusy] = useState(false);
  const open = async () => {
    setBusy(true);
    const daum = await loadPostcode();
    setBusy(false);
    if (!daum) return;
    new daum.Postcode({
      oncomplete: (d) => {
        const base = d.roadAddress || d.jibunAddress || d.address || "";
        const addr = d.buildingName ? `${base} (${d.buildingName})` : base;
        if (addr) onSelect(addr);
      },
    }).open();
  };
  return (
    <button type="button" className={className} onClick={open} disabled={busy}>
      {busy ? "여는 중…" : label}
    </button>
  );
}
