"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Kakao Map pin for a location address. Active only when NEXT_PUBLIC_KAKAO_JS_KEY is set
 * (renders nothing otherwise) — the same JS key used for KakaoTalk share. Loads the Maps
 * SDK + services (geocoder) once, geocodes the address, and drops a marker.
 * The app must have "Kakao 지도(Map)" enabled and the site domain registered in Kakao Developers.
 */
const KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
const SDK = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KEY ?? ""}&libraries=services&autoload=false`;

type KakaoMaps = {
  load: (cb: () => void) => void;
  Map: new (el: HTMLElement, opts: object) => unknown;
  Marker: new (opts: object) => unknown;
  LatLng: new (lat: number, lng: number) => unknown;
  services: {
    Geocoder: new () => { addressSearch: (addr: string, cb: (result: { x: string; y: string }[], status: string) => void) => void };
    Status: { OK: string };
  };
};
type KakaoNS = { maps?: KakaoMaps };

let loader: Promise<KakaoMaps | null> | null = null;
function loadKakaoMaps(): Promise<KakaoMaps | null> {
  if (!KEY || typeof window === "undefined") return Promise.resolve(null);
  const w = window as unknown as { kakao?: KakaoNS };
  if (w.kakao?.maps?.services) return Promise.resolve(w.kakao.maps);
  if (loader) return loader;
  loader = new Promise((resolve) => {
    const ready = () => {
      const maps = (window as unknown as { kakao?: KakaoNS }).kakao?.maps;
      if (!maps) return resolve(null);
      maps.load(() => resolve((window as unknown as { kakao?: KakaoNS }).kakao?.maps ?? null));
    };
    const existing = document.querySelector<HTMLScriptElement>("script[data-kakao-maps]");
    if (existing) {
      if ((window as unknown as { kakao?: KakaoNS }).kakao?.maps) ready();
      else existing.addEventListener("load", ready, { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = SDK;
    s.async = true;
    s.setAttribute("data-kakao-maps", "");
    s.addEventListener("load", ready, { once: true });
    s.addEventListener("error", () => resolve(null), { once: true });
    document.head.appendChild(s);
  });
  return loader;
}

export function LocationMap({ address, lat, lng, className }: { address?: string; lat?: number; lng?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ok, setOk] = useState(false);
  const hasCoords = typeof lat === "number" && typeof lng === "number" && !Number.isNaN(lat) && !Number.isNaN(lng);
  const query = address?.trim();

  useEffect(() => {
    if (!KEY || (!hasCoords && !query) || !ref.current) return;
    let cancelled = false;
    loadKakaoMaps().then((maps) => {
      if (cancelled || !maps || !ref.current) return;
      const el = ref.current;
      const drop = (y: number, x: number) => {
        const pos = new maps.LatLng(y, x);
        const map = new maps.Map(el, { center: pos, level: 3 });
        new maps.Marker({ position: pos, map });
        setOk(true);
      };
      if (hasCoords) return drop(lat as number, lng as number); // exact coords → no geocoding
      if (!maps.services || !query) return;
      new maps.services.Geocoder().addressSearch(query, (result, status) => {
        if (cancelled || status !== maps.services.Status.OK || !result[0] || !ref.current) return;
        drop(Number(result[0].y), Number(result[0].x));
      });
    });
    return () => {
      cancelled = true;
    };
  }, [query, hasCoords, lat, lng]);

  if (!KEY || (!hasCoords && !query)) return null;
  // Keep layout size so the map can render into it; invisible until the pin resolves.
  return <div ref={ref} className={className} style={{ visibility: ok ? "visible" : "hidden" }} aria-label="지도" />;
}
