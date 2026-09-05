import type { CoverContent } from "@/lib/invitation/types";

const BANNER = ` ███╗   ███╗ ██████╗ ██╗
 ████╗ ████║██╔═══██╗██║
 ██╔████╔██║██║   ██║██║
 ██║╚██╔╝██║██║   ██║██║
 ██║ ╚═╝ ██║╚██████╔╝██║
 ╚═╝     ╚═╝ ╚═════╝ ╚═╝
   L · E · T · T · E · R`;

const jsonColor = { str: "#C9D6BC", num: "#A0A8B8", bool: "#7ED77E", date: "#7ED77E" } as const;

export function DevCover({ content }: { content: CoverContent }) {
  return (
    <>
      <div className="d-titlebar">
        <div className="dot r" />
        <div className="dot y" />
        <div className="dot g" />
        <div className="name">moi-letter ~ zsh</div>
        <div className="status">● live</div>
      </div>

      <div className="d-cmd">
        <span className="prompt">$</span> moi <span className="flag">--invite</span>
        {content.from && (
          <>
            {" "}
            <span className="flag">--from={content.from}</span>
          </>
        )}
      </div>
      <div className="d-output">
        <span className="comment">{"// resolving invitation payload..."}</span>
      </div>
      <div className="d-output">
        <span className="key">status</span>: <span className="val">200 OK</span> ·{" "}
        <span className="comment">{"// ✓ published"}</span>
      </div>

      <div className="d-banner">{BANNER}</div>

      {content.json && (
        <>
          <div className="d-cmd">
            <span className="prompt">$</span> cat invitation.json
          </div>
          <div className="d-json">
            <span style={{ color: "#A9B69C" }}>{"{"}</span>
            {content.json.map((row, i) => (
              <span className="indent" key={i}>
                <span style={{ color: "#F5D896" }}>&quot;{row.k}&quot;</span>:{" "}
                <span style={{ color: jsonColor[row.t ?? "str"] }}>
                  {row.t === "num" || row.t === "bool" ? row.v : `"${row.v}"`}
                </span>
                {i < content.json!.length - 1 ? "," : ""}
              </span>
            ))}
            <span style={{ color: "#A9B69C" }}>{"}"}</span>
          </div>
        </>
      )}
    </>
  );
}
