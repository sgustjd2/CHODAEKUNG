import type { Metadata } from "next";
import "./globals.css";

// Absolute base for OG/Twitter image URLs. Set NEXT_PUBLIC_SITE_URL on Vercel for a stable domain;
// falls back to the deployment URL, then localhost.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "초대쿵 · 초대하는 순간까지, 예쁘게",
  description:
    "사진과 문구만 넣으면 완성되는 나만의 모바일 초대장. 결혼식·돌잔치부터 러닝·등산·조기축구·스터디·야구 관람까지, 카카오톡으로 바로 나누세요.",
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
