import type { Invitation } from "./types";
import { romanticSample } from "./sample-romantic";
import { minimalSample } from "./sample-minimal";

/** Placeholder store until a real data layer exists. */
export const sampleInvitations: Record<string, Invitation> = {
  [romanticSample.slug]: romanticSample,
  [minimalSample.slug]: minimalSample,
};

/** Look up by slug; falls back to the romantic sample so any demo link renders. */
export function getInvitation(slug: string): Invitation {
  return sampleInvitations[slug] ?? romanticSample;
}
