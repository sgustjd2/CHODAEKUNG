import type { Invitation } from "./types";
import { romanticSample } from "./sample-romantic";
import { minimalSample } from "./sample-minimal";
import { cuteSample } from "./sample-cute";
import { editorialSample } from "./sample-editorial";
import { developerSample } from "./sample-developer";
import { battleSample } from "./sample-battle";
import { timelineSamples } from "./sample-timeline";
import { gamingSamples } from "./sample-gaming";

/** Placeholder store until a real data layer exists. */
export const sampleInvitations: Record<string, Invitation> = {
  [romanticSample.slug]: romanticSample,
  [minimalSample.slug]: minimalSample,
  [cuteSample.slug]: cuteSample,
  [editorialSample.slug]: editorialSample,
  [developerSample.slug]: developerSample,
  [battleSample.slug]: battleSample,
  ...Object.fromEntries(timelineSamples.map((s) => [s.slug, s])),
  ...Object.fromEntries(gamingSamples.map((s) => [s.slug, s])),
};

/** Look up by slug; falls back to the romantic sample so any demo link renders. */
export function getInvitation(slug: string): Invitation {
  return sampleInvitations[slug] ?? romanticSample;
}
