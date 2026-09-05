import { Fragment } from "react";
import type { Line } from "@/lib/invitation/types";

/** Renders lines of rich text; lines join with <br>, `em` runs become <em> (styled per theme). */
export function Rich({ lines }: { lines: Line[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {typeof line === "string"
            ? line
            : line.map((run, j) =>
                typeof run === "string" ? (
                  <Fragment key={j}>{run}</Fragment>
                ) : run.em ? (
                  <em key={j}>{run.text}</em>
                ) : (
                  <Fragment key={j}>{run.text}</Fragment>
                )
              )}
        </Fragment>
      ))}
    </>
  );
}
