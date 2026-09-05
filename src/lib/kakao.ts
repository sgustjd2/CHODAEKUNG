/**
 * KakaoTalk share (Kakao JS SDK). Active only when NEXT_PUBLIC_KAKAO_JS_KEY is set —
 * otherwise the share button falls back to copying the link. The JS key is a public
 * client key (safe to expose); register the site's domain in Kakao Developers.
 */
const SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";

type KakaoShareArg = {
  objectType: "feed";
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: { mobileWebUrl: string; webUrl: string };
  };
  buttons?: { title: string; link: { mobileWebUrl: string; webUrl: string } }[];
};
type KakaoNS = {
  isInitialized: () => boolean;
  init: (key: string) => void;
  Share: { sendDefault: (arg: KakaoShareArg) => void };
};

export function kakaoEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
}

let loader: Promise<KakaoNS | null> | null = null;

/** Load + init the SDK once; resolves the Kakao namespace, or null if unavailable. */
export function ensureKakao(): Promise<KakaoNS | null> {
  const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
  if (!key || typeof window === "undefined") return Promise.resolve(null);
  const win = window as unknown as { Kakao?: KakaoNS };
  if (win.Kakao?.isInitialized?.()) return Promise.resolve(win.Kakao);
  if (loader) return loader;

  loader = new Promise<KakaoNS | null>((resolve) => {
    const init = () => {
      const K = (window as unknown as { Kakao?: KakaoNS }).Kakao;
      if (!K) return resolve(null);
      try {
        if (!K.isInitialized()) K.init(key);
      } catch {
        /* double-init or bad key — sendDefault will just no-op/throw and we fall back */
      }
      resolve(K);
    };
    const existing = document.querySelector<HTMLScriptElement>("script[data-kakao-sdk]");
    if (existing) {
      if ((window as unknown as { Kakao?: KakaoNS }).Kakao) init();
      else existing.addEventListener("load", init, { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = SDK_URL;
    s.async = true;
    s.crossOrigin = "anonymous";
    s.setAttribute("data-kakao-sdk", "");
    s.addEventListener("load", init, { once: true });
    s.addEventListener("error", () => resolve(null), { once: true });
    document.head.appendChild(s);
  });
  return loader;
}
