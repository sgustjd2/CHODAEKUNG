"use client";

import { Fragment, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

export type Template = {
  img: string;
  imgFilter?: string;
  badge?: { text: string; kind?: "free" | "pro" | "new" };
  catTag: string;
  name: ReactNode;
  meta: string[];
  fav?: boolean;
};

export function TemplateCard({ img, imgFilter, badge, catTag, name, meta, fav = false }: Template) {
  const [active, setActive] = useState(fav);
  const imgStyle: CSSProperties | undefined = imgFilter ? { filter: imgFilter } : undefined;
  return (
    <div className="tpl">
      <div className="thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/assets/photos/${img}.jpg`} alt="" style={imgStyle} />
        {badge && (
          <div className={["badge", badge.kind].filter(Boolean).join(" ")}>{badge.text}</div>
        )}
        <button
          type="button"
          className={["fav", active ? "active" : ""].filter(Boolean).join(" ")}
          aria-pressed={active}
          aria-label={active ? "즐겨찾기 해제" : "즐겨찾기"}
          onClick={() => setActive((v) => !v)}
        >
          <svg
            viewBox="0 0 24 24"
            fill={active ? "currentColor" : "none"}
            stroke={active ? "none" : "currentColor"}
            strokeWidth={2}
          >
            <use href={`/assets/moi-symbols.svg#${active ? "ic-heart-fill" : "ic-heart"}`} />
          </svg>
        </button>
      </div>
      <div className="info">
        <div className="cat-tag">{catTag}</div>
        <div className="name">{name}</div>
        <div className="meta">
          {meta.map((m, i) => (
            <Fragment key={i}>
              {i > 0 && <span className="dot" />}
              <span>{m}</span>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
