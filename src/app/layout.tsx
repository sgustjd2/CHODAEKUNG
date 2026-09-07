import type { Metadata, Viewport } from "next";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "초대쿵 · 초대하는 순간까지, 예쁘게",
  description:
    "사진과 문구만 넣으면 완성되는 나만의 모바일 초대장. 결혼식·돌잔치부터 러닝·등산·조기축구·스터디·야구 관람까지, 카카오톡으로 바로 나누세요.",
};

// Tints the mobile browser chrome to the app's paper ground for every viewer (light + dark).
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F1EA" },
    { media: "(prefers-color-scheme: dark)", color: "#2A2622" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
