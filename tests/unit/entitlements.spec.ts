import { test, expect } from "@playwright/test";
import { invitationTier, isPremium, canAddGalleryPhoto, FREE_LIMITS } from "../../src/lib/invitation/entitlements";

/**
 * Free vs premium gating — the single source of truth for the monetization boundary. Locks the
 * default-free behavior and the gallery cap so a regression can't silently give away premium or
 * wall free users.
 */
test.describe("entitlements", () => {
  test("tier defaults to free unless explicitly premium", () => {
    expect(invitationTier({ tier: "premium" })).toBe("premium");
    expect(invitationTier({ tier: "free" })).toBe("free");
    expect(invitationTier({ tier: undefined })).toBe("free");
    // any non-"premium" value is treated as free (fail-closed)
    expect(invitationTier({ tier: "garbage" as unknown as "free" })).toBe("free");
    expect(isPremium({ tier: undefined })).toBe(false);
    expect(isPremium({ tier: "premium" })).toBe(true);
  });

  test("free gallery cap = 10, enforced only up to the cap", () => {
    expect(FREE_LIMITS.galleryPhotos).toBe(10); // change is a deliberate product decision
    const free = { tier: "free" as const };
    expect(canAddGalleryPhoto(free, 0)).toBe(true);
    expect(canAddGalleryPhoto(free, 9)).toBe(true); // 10th photo allowed
    expect(canAddGalleryPhoto(free, 10)).toBe(false); // 11th blocked
    expect(canAddGalleryPhoto(free, 25)).toBe(false);
  });

  test("premium lifts the gallery cap entirely", () => {
    const premium = { tier: "premium" as const };
    expect(canAddGalleryPhoto(premium, 10)).toBe(true);
    expect(canAddGalleryPhoto(premium, 999)).toBe(true);
  });
});
