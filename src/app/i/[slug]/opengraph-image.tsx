import { ImageResponse } from "next/og";
import { getPublishedInvitation } from "@/lib/invitation/store";
import { invitationMeta } from "@/lib/invitation/meta";
import { siteUrl } from "@/lib/site";

// Per-invitation 1200×630 share card (KakaoTalk / OG / Twitter): the cover photo with a
// bottom gradient and the title + date + 초대쿵 mark overlaid — a proper landscape card
// instead of a raw portrait cover getting center-cropped by the platform.

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "초대장";

/** Fetch a Noto Sans KR subset covering exactly the glyphs we render (a full CJK font is far too
 * large for an OG render). Returns null on any failure so the card falls back to image-only. */
async function loadFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const uniq = Array.from(new Set(text.replace(/\s+/g, ""))).join("");
    if (!uniq) return null;
    const api = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(uniq)}`;
    // No browser User-Agent on purpose: Google then returns a TrueType subset. A modern UA yields
    // woff2, which this build's Satori can't decode ("Unsupported OpenType signature wOF2").
    const css = await fetch(api).then((r) => r.text());
    const url = css.match(/url\((https:\/\/[^)]+)\)\s*format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const inv = await getPublishedInvitation(slug);
  const meta = inv ? invitationMeta(inv) : { title: "초대장", description: "", image: "" };
  const title = meta.title || "초대장";
  const desc = meta.description || "";
  const img = meta.image ? (meta.image.startsWith("http") ? meta.image : `${siteUrl}${meta.image}`) : "";

  const fontData = await loadFont(`${title}${desc}초대쿵`);
  const fonts = fontData ? [{ name: "NotoKR", data: fontData, weight: 700 as const, style: "normal" as const }] : [];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", backgroundColor: "#211d1a" }}>
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} alt="" />
        ) : null}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            background: "linear-gradient(to top, rgba(0,0,0,0.78) 4%, rgba(0,0,0,0.30) 42%, rgba(0,0,0,0) 68%)",
          }}
        />
        {fontData ? (
          <div
            style={{
              position: "absolute",
              left: 72,
              right: 72,
              bottom: 64,
              display: "flex",
              flexDirection: "column",
              fontFamily: "NotoKR",
              color: "#ffffff",
            }}
          >
            <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, opacity: 0.82, marginBottom: 14 }}>초대쿵 · CHODAE KUNG</div>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.12 }}>{title}</div>
            {desc ? <div style={{ display: "flex", fontSize: 32, opacity: 0.92, marginTop: 18 }}>{desc}</div> : null}
          </div>
        ) : null}
      </div>
    ),
    { ...size, fonts },
  );
}
