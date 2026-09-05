import type { Invitation } from "./types";
import { romanticSample } from "./sample-romantic";
import { minimalSample } from "./sample-minimal";
import { battleSample } from "./sample-battle";

/** Placeholder store until a real data layer exists. */
export const sampleInvitations: Record<string, Invitation> = {
  [romanticSample.slug]: romanticSample,
  [minimalSample.slug]: minimalSample,
  [battleSample.slug]: battleSample,
};

/** Look up by slug; falls back to the romantic sample so any demo link renders. */
export function getInvitation(slug: string): Invitation {
  return sampleInvitations[slug] ?? romanticSample;
}
