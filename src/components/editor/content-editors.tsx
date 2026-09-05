"use client";

import { useState } from "react";
import { linesToText, plainTitle, textToLines } from "./editor-shared";
import { photoUrl } from "@/lib/photo";
import { uploadPhoto } from "@/lib/db/upload";
import type {
  AcceptContent,
  ChecklistContent,
  CostContent,
  CountdownContent,
  CoverContent,
  DateContent,
  DayPlanContent,
  DetailsContent,
  EndingContent,
  GalleryContent,
  GInfoContent,
  Invitation,
  LanesContent,
  LocationContent,
  MenuContent,
  MessageContent,
  NoticeContent,
  QuoteContent,
  RosterContent,
  RouteContent,
  RsvpContent,
  RulesContent,
  ScheduleContent,
  Section,
  SectionType,
  TierChartContent,
  TimelineSectionContent,
  VersusContent,
} from "@/lib/invitation/types";

/**
 * Per-section content editors, shared by the desktop inspector and the mobile bottom sheet
 * (one source of truth — no drift). Emits `.insp-*` markup, which is styled under `.editor-page`
 * for both layouts. Given the draft + a `patch(id, content)`, it finds each editable section
 * and renders its fields; edits flow straight to the shared draft → live preview.
 */
export function ContentEditors({ draft, patch }: { draft: Invitation; patch: (id: string, content: object) => void }) {
  const find = <T extends SectionType>(t: T) => draft.sections.find((s) => s.type === t) as Extract<Section, { type: T }> | undefined;
  const patchScheduleItems = (id: string, items: ScheduleContent["items"]) => patch(id, { items });

  const cover = find("cover");
  const message = find("message");
  const location = find("location");
  const date = find("date");
  const gallery = find("gallery");
  const schedule = find("schedule");
  const rsvp = find("rsvp");
  const ending = find("ending");
  const versus = find("versus");
  const countdown = find("countdown");
  const rules = find("rules");
  const accept = find("accept");
  const timeline = find("timeline");
  const checklist = find("checklist");
  const details = find("details");
  const notice = find("notice");
  const quote = find("quote");
  const lanes = find("lanes");
  const gInfo = find("gInfo");
  const tierChart = find("tierChart");
  const cost = find("cost");
  const route = find("route");
  const roster = find("roster");
  const menu = find("menu");
  const dayPlan = find("dayPlan");

  return (
    <>
      {cover && (
        <div className="insp-group">
          <h5>Cover Section</h5>
          <Field label="Eyebrow" value={cover.content.eyebrow} onChange={(v) => patch(cover.id, { eyebrow: v } satisfies Partial<CoverContent>)} />
          {cover.content.names?.map((n, i) => (
            <Field key={i} label={`이름 ${i + 1}`} value={n} onChange={(v) => patch(cover.id, { names: cover.content.names!.map((x, j) => (j === i ? v : x)) })} />
          ))}
          <Field label="날짜 표기" value={cover.content.dateLabel ?? ""} onChange={(v) => patch(cover.id, { dateLabel: v })} />
        </div>
      )}
      {message && (
        <div className="insp-group">
          <h5>Message</h5>
          <Field label="제목" value={plainTitle(message.content.title)} onChange={(v) => patch(message.id, { title: [[v]] } satisfies Partial<MessageContent>)} />
          <Field label="본문" textarea value={linesToText(message.content.body)} onChange={(v) => patch(message.id, { body: textToLines(v) } satisfies Partial<MessageContent>)} />
        </div>
      )}
      {location && (
        <div className="insp-group">
          <h5>Location</h5>
          <Field label="장소명" value={plainTitle(location.content.title)} onChange={(v) => patch(location.id, { title: [[v]] } satisfies Partial<LocationContent>)} />
          <Field label="주소 · 설명" textarea value={linesToText(location.content.body)} onChange={(v) => patch(location.id, { body: textToLines(v) })} />
        </div>
      )}
      {date && (
        <div className="insp-group">
          <h5>Date</h5>
          <Field label="Eyebrow" value={date.content.eyebrow} onChange={(v) => patch(date.id, { eyebrow: v } satisfies Partial<DateContent>)} />
          <Field label="제목" value={plainTitle(date.content.title)} onChange={(v) => patch(date.id, { title: [[v]] } satisfies Partial<DateContent>)} />
          {date.content.countdown && (
            <Field
              label="D-day (남은 일수)"
              value={String(date.content.countdown.days)}
              onChange={(v) => patch(date.id, { countdown: { ...date.content.countdown!, days: Math.max(0, Number(v) || 0) } })}
            />
          )}
        </div>
      )}
      {schedule && (
        <div className="insp-group">
          <h5>Schedule</h5>
          <Field label="Eyebrow" value={schedule.content.eyebrow} onChange={(v) => patch(schedule.id, { eyebrow: v } satisfies Partial<ScheduleContent>)} />
          <Field label="제목" value={plainTitle(schedule.content.title)} onChange={(v) => patch(schedule.id, { title: [[v]] } satisfies Partial<ScheduleContent>)} />
          {schedule.content.items.map((it, i) => (
            <div key={i} className="insp-subitem">
              <div className="insp-subitem-head">
                <span>#{i + 1}</span>
                <button type="button" onClick={() => patchScheduleItems(schedule.id, schedule.content.items.filter((_, j) => j !== i))}>삭제</button>
              </div>
              <Field label="시간" value={it.time} onChange={(v) => patchScheduleItems(schedule.id, schedule.content.items.map((x, j) => (j === i ? { ...x, time: v } : x)))} />
              <Field label="제목" value={it.title} onChange={(v) => patchScheduleItems(schedule.id, schedule.content.items.map((x, j) => (j === i ? { ...x, title: v } : x)))} />
              <Field label="설명" value={it.desc} onChange={(v) => patchScheduleItems(schedule.id, schedule.content.items.map((x, j) => (j === i ? { ...x, desc: v } : x)))} />
            </div>
          ))}
          <button type="button" className="insp-add" onClick={() => patchScheduleItems(schedule.id, [...schedule.content.items, { time: "", title: "", desc: "" }])}>
            + 일정 추가
          </button>
        </div>
      )}
      {gallery && (
        <div className="insp-group">
          <h5>Gallery</h5>
          <Field label="Eyebrow" value={gallery.content.eyebrow} onChange={(v) => patch(gallery.id, { eyebrow: v } satisfies Partial<GalleryContent>)} />
          <Field label="제목" value={plainTitle(gallery.content.title)} onChange={(v) => patch(gallery.id, { title: [[v]] } satisfies Partial<GalleryContent>)} />
          <div className="insp-photos">
            {gallery.content.images.map((im, i) => (
              <div key={i} className="insp-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl(im.src)} alt="" />
                <button type="button" aria-label="사진 삭제" onClick={() => patch(gallery.id, { images: gallery.content.images.filter((_, j) => j !== i) })}>
                  ×
                </button>
              </div>
            ))}
          </div>
          <PhotoUpload onUploaded={(url) => patch(gallery.id, { images: [...gallery.content.images, { src: url }] })} />
        </div>
      )}
      {rsvp && (
        <div className="insp-group">
          <h5>RSVP</h5>
          <Field label="제목" value={plainTitle(rsvp.content.title)} onChange={(v) => patch(rsvp.id, { title: [[v]] } satisfies Partial<RsvpContent>)} />
          <Field label="안내 문구" textarea value={linesToText(rsvp.content.body)} onChange={(v) => patch(rsvp.id, { body: textToLines(v) })} />
          <Field label="응답 옵션 (한 줄에 하나)" textarea value={rsvp.content.options.join("\n")} onChange={(v) => patch(rsvp.id, { options: v.split("\n").filter((o) => o.trim().length > 0) })} />
        </div>
      )}
      {versus && (
        <div className="insp-group">
          <h5>Versus · 매치업</h5>
          <Field label="홈팀 이름" value={versus.content.home.name} onChange={(v) => patch(versus.id, { home: { ...versus.content.home, name: v } } satisfies Partial<VersusContent>)} />
          <Field label="홈팀 설명" value={versus.content.home.meta} onChange={(v) => patch(versus.id, { home: { ...versus.content.home, meta: v } })} />
          <Field label="원정팀 이름" value={versus.content.away.name} onChange={(v) => patch(versus.id, { away: { ...versus.content.away, name: v } } satisfies Partial<VersusContent>)} />
          <Field label="원정팀 설명" value={versus.content.away.meta} onChange={(v) => patch(versus.id, { away: { ...versus.content.away, meta: v } })} />
        </div>
      )}
      {countdown && (
        <div className="insp-group">
          <h5>Countdown</h5>
          {countdown.content.cells.map((c, i) => (
            <div key={i} className="insp-subitem">
              <div className="insp-subitem-head">
                <span>{c.l || `#${i + 1}`}</span>
              </div>
              <Field label="숫자" value={c.n} onChange={(v) => patch(countdown.id, { cells: countdown.content.cells.map((x, j) => (j === i ? { ...x, n: v } : x)) } satisfies Partial<CountdownContent>)} />
              <Field label="라벨" value={c.l} onChange={(v) => patch(countdown.id, { cells: countdown.content.cells.map((x, j) => (j === i ? { ...x, l: v } : x)) })} />
            </div>
          ))}
        </div>
      )}
      {rules && (
        <div className="insp-group">
          <h5>Rules</h5>
          <Field label="제목" value={rules.content.title} onChange={(v) => patch(rules.id, { title: v } satisfies Partial<RulesContent>)} />
          {rules.content.rules.map((r, i) => (
            <div key={i} className="insp-subitem">
              <div className="insp-subitem-head">
                <span>#{i + 1}</span>
                <button type="button" onClick={() => patch(rules.id, { rules: rules.content.rules.filter((_, j) => j !== i) })}>삭제</button>
              </div>
              <Field label="항목" value={r.t} onChange={(v) => patch(rules.id, { rules: rules.content.rules.map((x, j) => (j === i ? { ...x, t: v } : x)) })} />
              <Field label="설명" value={r.d} onChange={(v) => patch(rules.id, { rules: rules.content.rules.map((x, j) => (j === i ? { ...x, d: v } : x)) })} />
            </div>
          ))}
          <button type="button" className="insp-add" onClick={() => patch(rules.id, { rules: [...rules.content.rules, { t: "", d: "" }] })}>+ 규칙 추가</button>
        </div>
      )}
      {accept && (
        <div className="insp-group">
          <h5>참석 응답 · CTA</h5>
          <Field label="제목" value={plainTitle(accept.content.title)} onChange={(v) => patch(accept.id, { title: [[v]] } satisfies Partial<AcceptContent>)} />
          <Field label="안내" value={accept.content.sub} onChange={(v) => patch(accept.id, { sub: v })} />
          <Field label="수락 버튼" value={accept.content.accept} onChange={(v) => patch(accept.id, { accept: v })} />
          <Field label="거절 버튼" value={accept.content.decline} onChange={(v) => patch(accept.id, { decline: v })} />
        </div>
      )}
      {timeline && (
        <div className="insp-group">
          <h5>Timeline · 진행 순서</h5>
          <Field label="Eyebrow" value={timeline.content.eyebrow} onChange={(v) => patch(timeline.id, { eyebrow: v } satisfies Partial<TimelineSectionContent>)} />
          <Field label="제목" value={plainTitle(timeline.content.title)} onChange={(v) => patch(timeline.id, { title: [[v]] } satisfies Partial<TimelineSectionContent>)} />
          {timeline.content.items.map((it, i) => (
            <div key={i} className="insp-subitem">
              <div className="insp-subitem-head">
                <span>#{i + 1}</span>
                <button type="button" onClick={() => patch(timeline.id, { items: timeline.content.items.filter((_, j) => j !== i) })}>삭제</button>
              </div>
              <Field label="시간" value={it.time} onChange={(v) => patch(timeline.id, { items: timeline.content.items.map((x, j) => (j === i ? { ...x, time: v } : x)) })} />
              <Field label="제목" value={it.title} onChange={(v) => patch(timeline.id, { items: timeline.content.items.map((x, j) => (j === i ? { ...x, title: v } : x)) })} />
              <Field label="설명" value={it.desc} onChange={(v) => patch(timeline.id, { items: timeline.content.items.map((x, j) => (j === i ? { ...x, desc: v } : x)) })} />
            </div>
          ))}
          <button type="button" className="insp-add" onClick={() => patch(timeline.id, { items: [...timeline.content.items, { time: "", title: "", desc: "" }] })}>+ 항목 추가</button>
        </div>
      )}
      {checklist && (
        <div className="insp-group">
          <h5>Checklist · 준비물</h5>
          <Field label="Eyebrow" value={checklist.content.eyebrow} onChange={(v) => patch(checklist.id, { eyebrow: v } satisfies Partial<ChecklistContent>)} />
          <Field label="제목" value={plainTitle(checklist.content.title)} onChange={(v) => patch(checklist.id, { title: [[v]] } satisfies Partial<ChecklistContent>)} />
          {checklist.content.items.map((it, i) => (
            <div key={i} className="insp-subitem">
              <div className="insp-subitem-head">
                <span>#{i + 1}</span>
                <button type="button" onClick={() => patch(checklist.id, { items: checklist.content.items.filter((_, j) => j !== i) })}>삭제</button>
              </div>
              <Field label="항목" value={it.text} onChange={(v) => patch(checklist.id, { items: checklist.content.items.map((x, j) => (j === i ? { ...x, text: v } : x)) })} />
              <Field label="담당" value={it.owner} onChange={(v) => patch(checklist.id, { items: checklist.content.items.map((x, j) => (j === i ? { ...x, owner: v } : x)) })} />
            </div>
          ))}
          <button type="button" className="insp-add" onClick={() => patch(checklist.id, { items: [...checklist.content.items, { text: "", owner: "" }] })}>+ 항목 추가</button>
        </div>
      )}
      {details && (
        <div className="insp-group">
          <h5>Details · 정보</h5>
          <Field label="Eyebrow" value={details.content.eyebrow} onChange={(v) => patch(details.id, { eyebrow: v } satisfies Partial<DetailsContent>)} />
          <Field label="제목" value={plainTitle(details.content.title)} onChange={(v) => patch(details.id, { title: [[v]] } satisfies Partial<DetailsContent>)} />
          {details.content.info.map((kv, i) => (
            <div key={i} className="insp-subitem">
              <div className="insp-subitem-head">
                <span>{kv.k || `#${i + 1}`}</span>
                <button type="button" onClick={() => patch(details.id, { info: details.content.info.filter((_, j) => j !== i) })}>삭제</button>
              </div>
              <Field label="항목" value={kv.k} onChange={(v) => patch(details.id, { info: details.content.info.map((x, j) => (j === i ? { ...x, k: v } : x)) })} />
              <Field label="값" value={kv.v} onChange={(v) => patch(details.id, { info: details.content.info.map((x, j) => (j === i ? { ...x, v } : x)) })} />
            </div>
          ))}
          <button type="button" className="insp-add" onClick={() => patch(details.id, { info: [...details.content.info, { k: "", v: "" }] })}>+ 항목 추가</button>
        </div>
      )}
      {notice && (
        <div className="insp-group">
          <h5>Notice · 안내</h5>
          <Field label="Eyebrow" value={notice.content.eyebrow} onChange={(v) => patch(notice.id, { eyebrow: v } satisfies Partial<NoticeContent>)} />
          <Field label="제목" value={plainTitle(notice.content.title)} onChange={(v) => patch(notice.id, { title: [[v]] } satisfies Partial<NoticeContent>)} />
          {notice.content.items.map((it, i) => (
            <div key={i} className="insp-subitem">
              <div className="insp-subitem-head">
                <span>#{i + 1}</span>
                <button type="button" onClick={() => patch(notice.id, { items: notice.content.items.filter((_, j) => j !== i) })}>삭제</button>
              </div>
              <Field label="항목" value={it.t} onChange={(v) => patch(notice.id, { items: notice.content.items.map((x, j) => (j === i ? { ...x, t: v } : x)) })} />
              <Field label="설명" value={it.d} onChange={(v) => patch(notice.id, { items: notice.content.items.map((x, j) => (j === i ? { ...x, d: v } : x)) })} />
            </div>
          ))}
          <button type="button" className="insp-add" onClick={() => patch(notice.id, { items: [...notice.content.items, { icon: "ic-info", tone: "ink", t: "", d: "" }] })}>+ 항목 추가</button>
        </div>
      )}
      {quote && (
        <div className="insp-group">
          <h5>Quote · 인용</h5>
          <Field label="문구" textarea value={linesToText(quote.content.text)} onChange={(v) => patch(quote.id, { text: textToLines(v) } satisfies Partial<QuoteContent>)} />
        </div>
      )}
      {lanes && (
        <div className="insp-group">
          <h5>Lanes · 라인업</h5>
          <Field label="Eyebrow" value={lanes.content.eyebrow} onChange={(v) => patch(lanes.id, { eyebrow: v } satisfies Partial<LanesContent>)} />
          <Field label="제목" value={plainTitle(lanes.content.title)} onChange={(v) => patch(lanes.id, { title: [[v]] } satisfies Partial<LanesContent>)} />
          {lanes.content.players.map((p, i) => (
            <div key={i} className="insp-subitem">
              <div className="insp-subitem-head">
                <span>{p.laneLabel || `#${i + 1}`}</span>
              </div>
              <Field label="이름" value={p.name} onChange={(v) => patch(lanes.id, { players: lanes.content.players.map((x, j) => (j === i ? { ...x, name: v } : x)) })} />
              <Field label="소환사명" value={p.summoner} onChange={(v) => patch(lanes.id, { players: lanes.content.players.map((x, j) => (j === i ? { ...x, summoner: v } : x)) })} />
              <Field label="티어" value={p.tier} onChange={(v) => patch(lanes.id, { players: lanes.content.players.map((x, j) => (j === i ? { ...x, tier: v } : x)) })} />
            </div>
          ))}
        </div>
      )}
      {gInfo && (
        <div className="insp-group">
          <h5>매치 정보</h5>
          <Field label="Eyebrow" value={gInfo.content.eyebrow} onChange={(v) => patch(gInfo.id, { eyebrow: v } satisfies Partial<GInfoContent>)} />
          <Field label="제목" value={plainTitle(gInfo.content.title)} onChange={(v) => patch(gInfo.id, { title: [[v]] } satisfies Partial<GInfoContent>)} />
          {gInfo.content.cells.map((c, i) => (
            <div key={i} className="insp-subitem">
              <div className="insp-subitem-head">
                <span>{c.k || `#${i + 1}`}</span>
                <button type="button" onClick={() => patch(gInfo.id, { cells: gInfo.content.cells.filter((_, j) => j !== i) })}>삭제</button>
              </div>
              <Field label="항목" value={c.k} onChange={(v) => patch(gInfo.id, { cells: gInfo.content.cells.map((x, j) => (j === i ? { ...x, k: v } : x)) })} />
              <Field label="값" value={c.v} onChange={(v) => patch(gInfo.id, { cells: gInfo.content.cells.map((x, j) => (j === i ? { ...x, v } : x)) })} />
            </div>
          ))}
          <button type="button" className="insp-add" onClick={() => patch(gInfo.id, { cells: [...gInfo.content.cells, { k: "", v: "" }] })}>+ 항목 추가</button>
        </div>
      )}
      {tierChart && (
        <div className="insp-group">
          <h5>티어 분포</h5>
          <Field label="Eyebrow" value={tierChart.content.eyebrow} onChange={(v) => patch(tierChart.id, { eyebrow: v } satisfies Partial<TierChartContent>)} />
          <Field label="제목" value={plainTitle(tierChart.content.title)} onChange={(v) => patch(tierChart.id, { title: [[v]] } satisfies Partial<TierChartContent>)} />
          {tierChart.content.cols.map((c, i) => (
            <div key={i} className="insp-subitem">
              <div className="insp-subitem-head">
                <span>{c.t}</span>
              </div>
              <Field label="라벨" value={c.t} onChange={(v) => patch(tierChart.id, { cols: tierChart.content.cols.map((x, j) => (j === i ? { ...x, t: v } : x)) })} />
              <Field label="인원" value={c.n} onChange={(v) => patch(tierChart.id, { cols: tierChart.content.cols.map((x, j) => (j === i ? { ...x, n: v } : x)) })} />
            </div>
          ))}
        </div>
      )}
      {cost && (
        <div className="insp-group">
          <h5>Cost · 비용</h5>
          <Field label="Eyebrow" value={cost.content.eyebrow} onChange={(v) => patch(cost.id, { eyebrow: v } satisfies Partial<CostContent>)} />
          <Field label="제목" value={plainTitle(cost.content.title)} onChange={(v) => patch(cost.id, { title: [[v]] } satisfies Partial<CostContent>)} />
          <Field label="합계" value={cost.content.total} onChange={(v) => patch(cost.id, { total: v } satisfies Partial<CostContent>)} />
          <Field label="분담 설명" value={plainTitle([cost.content.split])} onChange={(v) => patch(cost.id, { split: v } satisfies Partial<CostContent>)} />
        </div>
      )}
      {route && (
        <div className="insp-group">
          <h5>Route · 이동 경로</h5>
          <Field label="Eyebrow" value={route.content.eyebrow} onChange={(v) => patch(route.id, { eyebrow: v } satisfies Partial<RouteContent>)} />
          <Field label="제목" value={plainTitle(route.content.title)} onChange={(v) => patch(route.id, { title: [[v]] } satisfies Partial<RouteContent>)} />
          {route.content.stops.map((s, i) => (
            <div key={i} className="insp-subitem">
              <div className="insp-subitem-head">
                <span>#{i + 1}</span>
                <button type="button" onClick={() => patch(route.id, { stops: route.content.stops.filter((_, j) => j !== i) })}>삭제</button>
              </div>
              <Field label="장소" value={s.title} onChange={(v) => patch(route.id, { stops: route.content.stops.map((x, j) => (j === i ? { ...x, title: v } : x)) })} />
              <Field label="설명" value={s.meta} onChange={(v) => patch(route.id, { stops: route.content.stops.map((x, j) => (j === i ? { ...x, meta: v } : x)) })} />
              <Field label="시간" value={s.time} onChange={(v) => patch(route.id, { stops: route.content.stops.map((x, j) => (j === i ? { ...x, time: v } : x)) })} />
            </div>
          ))}
          <button type="button" className="insp-add" onClick={() => patch(route.id, { stops: [...route.content.stops, { icon: "ic-pin", title: "", meta: "", time: "" }] })}>+ 경유지 추가</button>
        </div>
      )}
      {roster && (
        <div className="insp-group">
          <h5>Roster · 명단</h5>
          {roster.content.groups.map((grp, gi) => (
            <div key={gi}>
              <Field
                label={`그룹 ${gi + 1} 이름`}
                value={grp.title}
                onChange={(v) => patch(roster.id, { groups: roster.content.groups.map((g, j) => (j === gi ? { ...g, title: v } : g)) } satisfies Partial<RosterContent>)}
              />
              {grp.players.map((p, pi) => (
                <div key={pi} className="insp-subitem">
                  <div className="insp-subitem-head">
                    <span>#{pi + 1}</span>
                    <button type="button" onClick={() => patch(roster.id, { groups: roster.content.groups.map((g, j) => (j === gi ? { ...g, players: g.players.filter((_, k) => k !== pi) } : g)) })}>삭제</button>
                  </div>
                  <Field label="이름" value={p.name} onChange={(v) => patch(roster.id, { groups: roster.content.groups.map((g, j) => (j === gi ? { ...g, players: g.players.map((x, k) => (k === pi ? { ...x, name: v } : x)) } : g)) })} />
                  <Field label="역할" value={p.role} onChange={(v) => patch(roster.id, { groups: roster.content.groups.map((g, j) => (j === gi ? { ...g, players: g.players.map((x, k) => (k === pi ? { ...x, role: v } : x)) } : g)) })} />
                </div>
              ))}
              <button type="button" className="insp-add" onClick={() => patch(roster.id, { groups: roster.content.groups.map((g, j) => (j === gi ? { ...g, players: [...g.players, { num: String(g.players.length + 1), name: "", role: "" }] } : g)) })}>+ 인원 추가</button>
            </div>
          ))}
        </div>
      )}
      {menu && (
        <div className="insp-group">
          <h5>Menu · 메뉴</h5>
          <Field label="Eyebrow" value={menu.content.eyebrow} onChange={(v) => patch(menu.id, { eyebrow: v } satisfies Partial<MenuContent>)} />
          <Field label="제목" value={plainTitle(menu.content.title)} onChange={(v) => patch(menu.id, { title: [[v]] } satisfies Partial<MenuContent>)} />
          {menu.content.cards.map((card, ci) => (
            <div key={ci}>
              <Field label={`카드 ${ci + 1} 제목`} value={card.heading} onChange={(v) => patch(menu.id, { cards: menu.content.cards.map((c, j) => (j === ci ? { ...c, heading: v } : c)) })} />
              {card.items.map((it, ii) => (
                <div key={ii} className="insp-subitem">
                  <div className="insp-subitem-head">
                    <span>#{ii + 1}</span>
                    <button type="button" onClick={() => patch(menu.id, { cards: menu.content.cards.map((c, j) => (j === ci ? { ...c, items: c.items.filter((_, k) => k !== ii) } : c)) })}>삭제</button>
                  </div>
                  <Field label="메뉴명" value={it.name} onChange={(v) => patch(menu.id, { cards: menu.content.cards.map((c, j) => (j === ci ? { ...c, items: c.items.map((x, k) => (k === ii ? { ...x, name: v } : x)) } : c)) })} />
                  <Field label="설명" value={it.meta} onChange={(v) => patch(menu.id, { cards: menu.content.cards.map((c, j) => (j === ci ? { ...c, items: c.items.map((x, k) => (k === ii ? { ...x, meta: v } : x)) } : c)) })} />
                </div>
              ))}
              <button type="button" className="insp-add" onClick={() => patch(menu.id, { cards: menu.content.cards.map((c, j) => (j === ci ? { ...c, items: [...c.items, { name: "", meta: "" }] } : c)) })}>+ 메뉴 추가</button>
            </div>
          ))}
        </div>
      )}
      {dayPlan && (
        <div className="insp-group">
          <h5>Day Plan · 일별 일정</h5>
          <Field label="Eyebrow" value={dayPlan.content.eyebrow} onChange={(v) => patch(dayPlan.id, { eyebrow: v } satisfies Partial<DayPlanContent>)} />
          <Field label="제목" value={plainTitle(dayPlan.content.title)} onChange={(v) => patch(dayPlan.id, { title: [[v]] } satisfies Partial<DayPlanContent>)} />
          {dayPlan.content.days.map((day, di) => (
            <div key={di}>
              <Field label={`일자 ${di + 1} 라벨`} value={day.label} onChange={(v) => patch(dayPlan.id, { days: dayPlan.content.days.map((d, j) => (j === di ? { ...d, label: v } : d)) })} />
              {day.items.map((it, ii) => (
                <div key={ii} className="insp-subitem">
                  <div className="insp-subitem-head">
                    <span>#{ii + 1}</span>
                    <button type="button" onClick={() => patch(dayPlan.id, { days: dayPlan.content.days.map((d, j) => (j === di ? { ...d, items: d.items.filter((_, k) => k !== ii) } : d)) })}>삭제</button>
                  </div>
                  <Field label="시간" value={it.time} onChange={(v) => patch(dayPlan.id, { days: dayPlan.content.days.map((d, j) => (j === di ? { ...d, items: d.items.map((x, k) => (k === ii ? { ...x, time: v } : x)) } : d)) })} />
                  <Field label="제목" value={it.title} onChange={(v) => patch(dayPlan.id, { days: dayPlan.content.days.map((d, j) => (j === di ? { ...d, items: d.items.map((x, k) => (k === ii ? { ...x, title: v } : x)) } : d)) })} />
                  <Field label="설명" value={it.desc} onChange={(v) => patch(dayPlan.id, { days: dayPlan.content.days.map((d, j) => (j === di ? { ...d, items: d.items.map((x, k) => (k === ii ? { ...x, desc: v } : x)) } : d)) })} />
                </div>
              ))}
              <button type="button" className="insp-add" onClick={() => patch(dayPlan.id, { days: dayPlan.content.days.map((d, j) => (j === di ? { ...d, items: [...d.items, { time: "", title: "", desc: "" }] } : d)) })}>+ 항목 추가</button>
            </div>
          ))}
        </div>
      )}
      {ending && (
        <div className="insp-group">
          <h5>Ending</h5>
          <Field label="맺음말" value={ending.content.signature ?? ""} onChange={(v) => patch(ending.id, { signature: v } satisfies Partial<EndingContent>)} />
          <Field label="서명 (이름)" value={ending.content.names ?? ""} onChange={(v) => patch(ending.id, { names: v } satisfies Partial<EndingContent>)} />
        </div>
      )}
      {!cover && !message && !location && !date && !gallery && !schedule && !rsvp && !ending && !versus && !countdown && !rules && !accept && !timeline && !checklist && !details && !notice && !quote && !lanes && !gInfo && !tierChart && !cost && !route && !roster && !menu && !dayPlan && (
        <div className="insp-group">
          <h5>Content</h5>
          <p style={{ fontSize: 12, color: "var(--fg-3)", lineHeight: 1.6 }}>이 테마의 섹션별 상세 편집은 순차적으로 추가됩니다.</p>
        </div>
      )}
    </>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div className="insp-field">
      <div className="insp-label">{label}</div>
      {textarea ? (
        <textarea className="insp-input" rows={4} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="insp-input" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function PhotoUpload({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <div>
      <label className="insp-add" style={{ display: "block", textAlign: "center", cursor: busy ? "default" : "pointer" }}>
        {busy ? "업로드 중…" : "+ 사진 업로드"}
        <input
          type="file"
          accept="image/*"
          hidden
          disabled={busy}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setBusy(true);
            setErr("");
            const res = await uploadPhoto(file);
            setBusy(false);
            e.target.value = "";
            if ("url" in res) onUploaded(res.url);
            else setErr(res.error);
          }}
        />
      </label>
      {err && <div style={{ fontSize: 11, color: "var(--wax-deep)", marginTop: 4 }}>{err}</div>}
    </div>
  );
}
