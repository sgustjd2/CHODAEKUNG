import type { Line } from "./types";

/** Flatten a rich Line (string | Run[]) to plain text. */
export function lineToText(line: unknown): string {
  if (typeof line === "string") return line;
  if (Array.isArray(line)) return line.map((r) => (typeof r === "string" ? r : (r as { text?: string })?.text ?? "")).join("");
  return "";
}

/** Read a value at a dot-path (numeric segments index arrays). */
export function getAtPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((cur, key) => (cur == null ? undefined : (cur as Record<string, unknown>)[key]), obj);
}

/** Flatten any inline-editable leaf value (string, Line[], or string[]) to comparable plain text. */
export function flattenText(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return (v as (string | Line)[]).map(lineToText).join("\n");
  return "";
}
