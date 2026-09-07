import type { MetadataRoute } from "next";

/** Web app manifest — enables add-to-home-screen with the brand icon and a branded splash.
 * Next serves this at /manifest.webmanifest and links it automatically. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "초대쿵 · CHODAE KUNG",
    short_name: "초대쿵",
    description: "사진과 문구만 넣으면 완성되는 나만의 모바일 초대장.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F1EA",
    theme_color: "#F5F1EA",
    lang: "ko",
    icons: [
      // SVG mark scales to any size; modern browsers accept it for install/home-screen.
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any", purpose: "any" },
    ],
  };
}
