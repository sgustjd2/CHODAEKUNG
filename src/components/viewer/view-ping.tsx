"use client";

import { useEffect } from "react";
import { bumpViewAction } from "@/lib/invitation/actions";

/** Counts one view when a published invitation is opened. Rendered only on the live viewer. */
export function ViewPing({ slug }: { slug: string }) {
  useEffect(() => {
    bumpViewAction(slug);
  }, [slug]);
  return null;
}
