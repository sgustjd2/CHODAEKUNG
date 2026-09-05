"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";

export type Template = {
  img: string;
  imgFilter?: string;
  badge?: { text: string; kind?: "free" | "pro" | "new" };
  catTag: string;
  name: ReactNode;
  meta: string[];
  fav?: boolean;
};

// Each template thumbnail maps to the built theme sample it starts from (by cover image → theme).
// Clicking a card opens the editor seeded with that sample; unknown → blank canvas.
const SAMPLE_BY_IMG: Record<string, string> = {
  romantic_wedding: "jisoo-minjun", hero_flatlay: "jisoo-minjun", wedding_gallery_1: "jisoo-minjun", wedding_gallery_2: "jisoo-minjun",
  minimal_birthday: "appa-60", tmpl_doljanchi: "cozy-home",
  cute_housewarming: "cozy-home", timeline_gathering: "jibdeuli",
  battle_sports: "jogi-battle", tmpl_badminton: "jogi-battle", tmpl_baseball: "jogi-battle", tmpl_tennis: "jogi-battle",
  tmpl_gaming: "lol-quick", developer_terminal: "dev-meetup",
  tmpl_running: "beongae", tmpl_hiking: "beongae", tmpl_camping: "yangyang-mt", tmpl_picnic: "beongae", tmpl_travel: "yangyang-mt",
  tmpl_study: "beongae", tmpl_yoga: "beongae", tmpl_pet: "cozy-home",
  editorial_party: "after-hours", tmpl_yearend: "after-hours", tmpl_bridalshower: "after-hours", tmpl_seminar: "after-hours",
};

export function TemplateCard({ img, imgFilter, badge, catTag, name, meta, fav = false }: Template) {
  const router = useRouter();
  const [active, setActive] = useState(fav);
  const imgStyle: CSSProperties | undefined = imgFilter ? { filter: imgFilter } : undefined;
  const tpl = SAMPLE_BY_IMG[img];
  const href = tpl ? `/editor?template=${tpl}` : "/new";
  const go = () => router.push(href);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go();
    }
  };
  return (
    <div className="tpl" role="link" tabIndex={0} onClick={go} onKeyDown={onKey} style={{ cursor: "pointer" }} aria-label={`${catTag} 템플릿으로 시작`}>
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
          onClick={(e) => { e.stopPropagation(); setActive((v) => !v); }}
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
