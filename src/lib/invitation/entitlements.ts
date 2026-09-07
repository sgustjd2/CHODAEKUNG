import type { Invitation } from "./types";

/**
 * Monetization entitlements — the single source of truth for the free vs premium boundary.
 *
 * Model (chosen): per-invitation, one-time unlock. An invitation is "free" until it's unlocked
 * to "premium" (a future one-time payment flips its tier). Premium lifts the free-tier limits and
 * turns on the premium-only features below.
 *
 * SCAFFOLD STATUS: real payments are not wired yet, so `tier` is read from the invitation data and
 * nothing here charges money. Enforcement is deliberately limited to gating NEW actions (e.g.
 * adding gallery photos beyond the free cap) + upsell CTAs, so no existing invitation loses
 * functionality before there's a way to pay. When payments land: (1) make `tier` a
 * server-authoritative flag set by the payment webhook (not client-editable data), and (2) turn on
 * the remaining gates (advanced analytics, etc.).
 */

export type Tier = "free" | "premium";

/** Free-tier per-invitation limits. Premium lifts these. Keep generous so most free users never
 * hit them — the cap is the upsell funnel, not a wall. */
export const FREE_LIMITS = {
  galleryPhotos: 10,
} as const;

/** Premium-only features, shown in the upgrade CTA. `key`s are referenced by the gates. */
export const PREMIUM_FEATURES: { key: string; label: string }[] = [
  { key: "advancedAnalytics", label: "고급 응답 분석 — 추이·구성 차트와 CSV 내보내기" },
  { key: "capacity", label: `대용량 — 갤러리 사진 ${FREE_LIMITS.galleryPhotos}장 이상, 넉넉한 저장` },
];

/** One-time price shown in the CTA (display only; no charge happens yet). */
export const PREMIUM_PRICE_LABEL = "초대장당 1회 결제";

export function invitationTier(inv: Pick<Invitation, "tier">): Tier {
  return inv.tier === "premium" ? "premium" : "free";
}

export function isPremium(inv: Pick<Invitation, "tier">): boolean {
  return invitationTier(inv) === "premium";
}

/** Can this invitation still add another gallery photo, or is it at the free cap? */
export function canAddGalleryPhoto(inv: Pick<Invitation, "tier">, currentCount: number): boolean {
  return isPremium(inv) || currentCount < FREE_LIMITS.galleryPhotos;
}
