"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { InvitationViewer } from "@/components/viewer/invitation-viewer";
import { PublishDialog } from "@/components/editor/publish-dialog";
import { MobileEditor, type EditorApi } from "@/components/editor/mobile-editor";
import { ACCENTS, COVER_PHOTOS, THEME_PRESETS, linesToText, metaFor, plainTitle, textToLines, type Mode } from "@/components/editor/editor-shared";
import { romanticSample } from "@/lib/invitation/sample-romantic";
import { getInvitation } from "@/lib/invitation/samples";
import type { AcceptContent, ChecklistContent, CountdownContent, CoverContent, DateContent, DetailsContent, EndingContent, GalleryContent, Invitation, LocationContent, MessageContent, RsvpContent, RulesContent, ScheduleContent, Section, SectionType, TimelineSectionContent, VersusContent } from "@/lib/invitation/types";

type Tab = "content" | "style" | "layout" | "anim";

// ponytail: localStorage draft store — swap for a real backend when multi-device/sharing lands
const STORAGE_KEY = "chodaekung:editor:v1";
type SavedEditor = { draft?: Invitation; title?: string; hidden?: string[]; accent?: string | null };
const keyFor = (slug: string) => `${STORAGE_KEY}:${slug}`;

/** A friendly default editor title for an invitation (cover names, else slug). */
function defaultTitleFor(inv: Invitation): string {
  const cover = inv.sections.find((s) => s.type === "cover") as Extract<Section, { type: "cover" }> | undefined;
  const names = cover?.content.names;
  if (names && names.length) return names.join(" · ");
  return inv.slug;
}

export function EditorClient() {
  const [draft, setDraft] = useState<Invitation>(() => structuredClone(romanticSample));
  const [title, setTitle] = useState("지수 · 민준의 결혼식");
  const [selectedId, setSelectedId] = useState(draft.sections[0]?.id ?? "");
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<Tab>("content");
  const [mode, setMode] = useState<Mode>("scroll");
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [accent, setAccent] = useState<string | null>(null);
  const [pubOpen, setPubOpen] = useState(false);
  const [slug, setSlug] = useState(romanticSample.slug);
  const [hydrated, setHydrated] = useState(false);
  const dragIndex = useRef<number | null>(null);

  // On mount: resolve ?slug= (which invitation to edit), then load its saved draft or the sample.
  // (SSR renders the romantic sample; this client effect swaps in the right invitation — no mismatch.)
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("slug")?.trim() || romanticSample.slug;
    let d = getInvitation(s);
    let loadedTitle: string | null = null;
    try {
      const raw = localStorage.getItem(keyFor(s));
      if (raw) {
        const saved = JSON.parse(raw) as SavedEditor;
        if (saved.draft) d = saved.draft;
        if (typeof saved.title === "string") loadedTitle = saved.title;
        if (Array.isArray(saved.hidden)) setHidden(new Set(saved.hidden));
        if (saved.accent !== undefined) setAccent(saved.accent);
      }
    } catch {
      /* private mode / corrupt value — fall back to the sample */
    }
    setDraft(d);
    setSelectedId(d.sections[0]?.id ?? "");
    setTitle(loadedTitle ?? defaultTitleFor(d));
    setSlug(s);
    setHydrated(true);
  }, []);

  // Autosave (per invitation) after hydration so edits survive a refresh.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(keyFor(slug), JSON.stringify({ draft, title, hidden: [...hidden], accent } satisfies SavedEditor));
    } catch {
      /* storage unavailable — skip; edits stay in memory */
    }
  }, [hydrated, slug, draft, title, hidden, accent]);

  const visibleDraft: Invitation = { ...draft, sections: draft.sections.filter((s) => !hidden.has(s.id)) };
  const find = <T extends SectionType>(t: T) =>
    draft.sections.find((s) => s.type === t) as Extract<Section, { type: T }> | undefined;

  const patch = (id: string, content: object) =>
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === id ? ({ ...s, content: { ...s.content, ...content } } as Section) : s)),
    }));

  const toggleHide = (id: string) =>
    setHidden((h) => {
      const n = new Set(h);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const del = (id: string) => setDraft((d) => ({ ...d, sections: d.sections.filter((s) => s.id !== id) }));
  const duplicate = (id: string) =>
    setDraft((d) => {
      const i = d.sections.findIndex((s) => s.id === id);
      if (i < 0) return d;
      const clone = structuredClone(d.sections[i]);
      clone.id = `${clone.id}-copy-${Date.now().toString(36)}`;
      const s = [...d.sections];
      s.splice(i + 1, 0, clone);
      return { ...d, sections: s };
    });
  const addSection = () =>
    setDraft((d) => {
      const s: Section = {
        id: `message-${Date.now().toString(36)}`,
        type: "message",
        content: { eyebrow: "New Section", title: [["새 섹션"]], body: ["여기에 내용을 입력하세요."] },
      };
      return { ...d, sections: [...d.sections, s] };
    });
  const reorder = (to: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from == null || from === to) return;
    setDraft((d) => {
      const s = [...d.sections];
      const [m] = s.splice(from, 1);
      s.splice(to, 0, m);
      return { ...d, sections: s };
    });
  };

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
  /** Update one item in a section whose content has an `items` array. */
  const patchScheduleItems = (id: string, items: ScheduleContent["items"]) => patch(id, { items });
  const previewStyle = accent ? ({ ["--wax"]: accent, ["--wax-deep"]: accent } as CSSProperties) : undefined;

  const api: EditorApi = {
    draft,
    visibleDraft,
    setDraft,
    title,
    selectedId,
    setSelectedId,
    mode,
    setMode,
    accent,
    setAccent,
    previewStyle,
    patch,
    addSection,
    reorder,
    dragIndex,
    cover,
    message,
    location,
    date,
    gallery,
    schedule,
    rsvp,
    ending,
    openPublish: () => setPubOpen(true),
  };

  return (
    <div className="editor-page">
      <div className="ed-desktop">
      {/* TOP BAR */}
      <div className="top">
        <div className="top-left">
          <Link className="top-logo" href="/">
            <Logo />
          </Link>
          <span className="top-crumb">Dashboard · Editor</span>
          <input className="top-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="save-indicator">
            <span className="d" /> Saved · 방금 전
          </div>
        </div>
        <div className="top-right">
          <div className="mode-toggle">
            {(["scroll", "story", "magazine"] as Mode[]).map((m) => (
              <button key={m} className={mode === m ? "active" : undefined} onClick={() => setMode(m)}>
                {m === "scroll" ? "Scroll" : m === "story" ? "Story" : "Magazine"}
              </button>
            ))}
          </div>
          <div className="device-toggle">
            <button className={device === "mobile" ? "active" : undefined} onClick={() => setDevice("mobile")}>
              Mobile
            </button>
            <button className={device === "desktop" ? "active" : undefined} onClick={() => setDevice("desktop")}>
              Desktop
            </button>
          </div>
          <Button variant="ghost" size="sm">미리보기</Button>
          <Button variant="wax" size="sm" onClick={() => setPubOpen(true)}>발행 · 공유 →</Button>
        </div>
      </div>

      <div className="editor">
        {/* LEFT: sections */}
        <aside className="col-sections">
          <div className="col-head">
            <h4>Sections</h4>
            <button className="add-section" title="섹션 추가" onClick={addSection}>
              <Icon name="ic-plus" />
            </button>
          </div>
          <div className="sec-list">
            {draft.sections.map((s, i) => {
              const m = metaFor(s.type);
              return (
                <div
                  key={s.id}
                  className={`sec-item${selectedId === s.id ? " active" : ""}${hidden.has(s.id) ? " hidden-sec" : ""}`}
                  onClick={() => setSelectedId(s.id)}
                  draggable
                  onDragStart={() => (dragIndex.current = i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => reorder(i)}
                >
                  <span className="sec-drag">
                    <Icon name="ic-drag" />
                  </span>
                  <span className="sec-icon">
                    <Icon name={m.icon} />
                  </span>
                  <div className="sec-info">
                    <div className="sec-name">{m.label}</div>
                    <div className="sec-type">{s.type}</div>
                  </div>
                  <div className="sec-actions">
                    <button title="숨김" onClick={(e) => { e.stopPropagation(); toggleHide(s.id); }}>
                      <Icon name={hidden.has(s.id) ? "ic-eye" : "ic-eye-off"} />
                    </button>
                    <button title="복제" onClick={(e) => { e.stopPropagation(); duplicate(s.id); }}>
                      <Icon name="ic-duplicate" />
                    </button>
                    <button title="삭제" onClick={(e) => { e.stopPropagation(); del(s.id); }}>
                      <Icon name="ic-x" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* CENTER: preview */}
        <div className="col-preview">
          <div className="preview-toolbar">
            <span className="d" /> LIVE PREVIEW · 390 × 844 · {mode.toUpperCase()} MODE
          </div>
          <div className={`device${device === "desktop" ? " desktop" : ""}`}>
            <div className="notch" />
            <div className="screen">
              <div className="phone-scroll" style={previewStyle}>
                <InvitationViewer invitation={visibleDraft} contained />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: inspector */}
        <aside className="col-inspector">
          <div className="inspector-tabs">
            {(["content", "style", "layout", "anim"] as Tab[]).map((t) => (
              <button key={t} className={`insp-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
                {t === "content" ? "Content" : t === "style" ? "Style" : t === "layout" ? "Layout" : "Animation"}
              </button>
            ))}
          </div>

          <div className="inspector-body">
            {tab === "content" && (
              <>
                {cover && (
                  <div className="insp-group">
                    <h5>Cover Section</h5>
                    <Field label="Eyebrow" value={cover.content.eyebrow} onChange={(v) => patch(cover.id, { eyebrow: v } satisfies Partial<CoverContent>)} />
                    {cover.content.names?.map((n, i) => (
                      <Field
                        key={i}
                        label={`이름 ${i + 1}`}
                        value={n}
                        onChange={(v) => patch(cover.id, { names: cover.content.names!.map((x, j) => (j === i ? v : x)) })}
                      />
                    ))}
                    <Field label="날짜 표기" value={cover.content.dateLabel ?? ""} onChange={(v) => patch(cover.id, { dateLabel: v })} />
                  </div>
                )}
                {message && (
                  <div className="insp-group">
                    <h5>Message</h5>
                    <Field label="제목" value={plainTitle(message.content.title)} onChange={(v) => patch(message.id, { title: [[v]] } satisfies Partial<MessageContent>)} />
                    <Field
                      label="본문"
                      textarea
                      value={linesToText(message.content.body)}
                      onChange={(v) => patch(message.id, { body: textToLines(v) } satisfies Partial<MessageContent>)}
                    />
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
                          <button type="button" onClick={() => patchScheduleItems(schedule.id, schedule.content.items.filter((_, j) => j !== i))}>
                            삭제
                          </button>
                        </div>
                        <Field label="시간" value={it.time} onChange={(v) => patchScheduleItems(schedule.id, schedule.content.items.map((x, j) => (j === i ? { ...x, time: v } : x)))} />
                        <Field label="제목" value={it.title} onChange={(v) => patchScheduleItems(schedule.id, schedule.content.items.map((x, j) => (j === i ? { ...x, title: v } : x)))} />
                        <Field label="설명" value={it.desc} onChange={(v) => patchScheduleItems(schedule.id, schedule.content.items.map((x, j) => (j === i ? { ...x, desc: v } : x)))} />
                      </div>
                    ))}
                    <button type="button" className="insp-add" onClick={() => patchScheduleItems(schedule.id, [...schedule.content.items, { time: "00:00", title: "새 일정", desc: "" }])}>
                      + 일정 추가
                    </button>
                  </div>
                )}
                {gallery && (
                  <div className="insp-group">
                    <h5>Gallery</h5>
                    <Field label="Eyebrow" value={gallery.content.eyebrow} onChange={(v) => patch(gallery.id, { eyebrow: v } satisfies Partial<GalleryContent>)} />
                    <Field label="제목" value={plainTitle(gallery.content.title)} onChange={(v) => patch(gallery.id, { title: [[v]] } satisfies Partial<GalleryContent>)} />
                    <p style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 4 }}>사진 {gallery.content.images.length}장 · 이미지 업로드/교체는 곧 지원돼요.</p>
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
                    <button type="button" className="insp-add" onClick={() => patch(rules.id, { rules: [...rules.content.rules, { t: "새 규칙", d: "" }] })}>
                      + 규칙 추가
                    </button>
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
                    <button type="button" className="insp-add" onClick={() => patch(timeline.id, { items: [...timeline.content.items, { time: "00:00", title: "새 항목", desc: "" }] })}>
                      + 항목 추가
                    </button>
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
                    <button type="button" className="insp-add" onClick={() => patch(checklist.id, { items: [...checklist.content.items, { text: "새 항목", owner: "" }] })}>
                      + 항목 추가
                    </button>
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
                    <button type="button" className="insp-add" onClick={() => patch(details.id, { info: [...details.content.info, { k: "항목", v: "" }] })}>
                      + 항목 추가
                    </button>
                  </div>
                )}
                {ending && (
                  <div className="insp-group">
                    <h5>Ending</h5>
                    <Field label="맺음말" value={ending.content.signature ?? ""} onChange={(v) => patch(ending.id, { signature: v } satisfies Partial<EndingContent>)} />
                    <Field label="서명 (이름)" value={ending.content.names ?? ""} onChange={(v) => patch(ending.id, { names: v } satisfies Partial<EndingContent>)} />
                  </div>
                )}
                {!cover && !message && !location && !date && !gallery && !schedule && !rsvp && !ending && !versus && !countdown && !rules && !accept && !timeline && !checklist && !details && (
                  <div className="insp-group">
                    <h5>Content</h5>
                    <p style={{ fontSize: 12, color: "var(--fg-3)", lineHeight: 1.6 }}>이 테마의 섹션별 상세 편집은 순차적으로 추가됩니다.</p>
                  </div>
                )}
              </>
            )}

            {tab === "style" && (
              <>
                <div className="insp-group">
                  <h5>Theme Preset</h5>
                  <div className="radio-group">
                    {THEME_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        className={`radio-btn${draft.theme === p.id ? " active" : ""}`}
                        disabled={!p.enabled}
                        onClick={() => p.enabled && setDraft((d) => ({ ...d, theme: p.id }))}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 8 }}>
                    같은 데이터가 테마만 바꿔 즉시 다시 렌더돼요.
                  </p>
                </div>
                <div className="insp-group">
                  <h5>Accent Color</h5>
                  <div className="color-row">
                    {ACCENTS.map((c) => (
                      <button
                        key={c}
                        className={`color-swatch${accent === c ? " active" : ""}`}
                        style={{ background: c }}
                        aria-label={c}
                        onClick={() => setAccent(c)}
                      />
                    ))}
                  </div>
                </div>
                <div className="insp-group">
                  <h5>Cover Background</h5>
                  <div className="cover-thumbs">
                    {COVER_PHOTOS.map((p) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={p}
                        src={`/assets/photos/${p}.jpg`}
                        alt=""
                        className={`cover-thumb${cover?.content.image === p ? " active" : ""}`}
                        onClick={() => cover && patch(cover.id, { image: p })}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {tab === "layout" && <StubPanel note="레이아웃 컨트롤(높이·패딩·정렬·라운드)은 곧 연결됩니다." />}
            {tab === "anim" && <StubPanel note="애니메이션(Fade Up·Slide·Zoom·Blur·Parallax)은 곧 연결됩니다." />}
          </div>

          <div className="foot">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const base = getInvitation(slug);
                setDraft(structuredClone(base));
                setSelectedId(base.sections[0]?.id ?? "");
                setTitle(defaultTitleFor(base));
                setHidden(new Set());
                setAccent(null);
              }}
            >
              되돌리기
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                try {
                  localStorage.setItem(keyFor(slug), JSON.stringify({ draft, title, hidden: [...hidden], accent } satisfies SavedEditor));
                } catch {
                  /* storage unavailable */
                }
              }}
            >
              저장
            </Button>
          </div>
        </aside>
      </div>
      </div>

      <MobileEditor api={api} />

      <PublishDialog open={pubOpen} onClose={() => setPubOpen(false)} invitation={draft} title={title} />
    </div>
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

function StubPanel({ note }: { note: string }) {
  return (
    <div className="insp-group">
      <p style={{ fontSize: 12, color: "var(--fg-3)", lineHeight: 1.6 }}>{note}</p>
    </div>
  );
}
