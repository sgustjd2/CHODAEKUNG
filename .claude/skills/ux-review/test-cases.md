# UX Test Cases — CHODAE KUNG

Perform each case (don't eyeball). Mark PASS / FAIL(severity) / N-A. IDs are stable so audits are comparable over time.

## A. Landing & Wizard (`/`, `/new`)
- A1 Landing: primary CTA obvious; value prop clear in one glance on mobile; no horizontal scroll.
- A2 Wizard start: can a first-timer reach a draft in < ~1 min? Steps labelled, back works, progress shown.
- A3 Wizard "처음부터"(blank) vs template: both reach the editor; blank seeds the date section; typed title carries over.
- A4 Wizard inputs: date/time pickers native + sensible; required fields validated with a clear message.
- A5 Refresh mid-wizard / mid-edit: no data loss (autosave).

## B. Editor — desktop (`/editor`)
- B1 Section list: select scrolls preview to that section; drag reorder; hide/duplicate/delete; type change.
- B2 Inline edit: tap text in the center preview → edit in place → commits (blur/Enter); empty field shows a field-specific ghost (제목/이름/날짜…) and is still tappable.
- B3 Inline edit doesn't crash on multi-run rich text; em/emphasis preserved on no-op.
- B4 Right inspector tabs (Content/Style/Layout/Animation) switch; changes reflect live.
- B5 Add section picker: only theme-renderable types; adding starts empty (no placeholder junk).
- B6 Save status ("SAVED"); "되돌리기" needs a 2nd confirm click and only then resets; "색상·글씨 초기화" clears design (keeps content) and disables when clean.
- B7 Theme preset switch re-renders same content; hidden-section note shown for gaming/developer.

## C. Editor — mobile (375, `/editor`)
- C1 Bottom-sheet nav (내용/디자인/섹션/효과) reachable; sheet opens/closes; backdrop dismiss.
- C2 Inline edit works by tapping preview text; keyboard doesn't permanently hide the edited field.
- C3 Section tap in preview selects it (so 디자인 "선택한 섹션" targets it).
- C4 Design panel controls all reachable without cramping; palette chips + color chips tappable (≥ target size).
- C5 No horizontal overflow anywhere; toolbar/actions thumb-reachable.

## D. Customization (Style tab, both surfaces)
- D1 Palette one-click sets accent+bg+text coherently; "기본" resets.
- D2 Accent: preset + custom(color input) + "테마 기본색"; applies live.
- D3 Font: 6 faces; only the chosen webfont loads; applies to body+titles.
- D4 Size 작게/기본/크게 scales text, not layout. 자간/줄간격 좁게/기본/넓게 shift, ratios preserved.
- D5 글씨색 / 배경색 presets + custom + reset.
- D6 Per-section accent/bg overrides one section only; auto-contrast (--wax-ink) keeps its buttons legible.
- **D7 CONTRAST SWEEP**: for accents {default, gold #F5D896, sage #B5CAB2, navy #2A2A3E} × themes {romantic, minimal, cute, editorial, timeline, battle, gaming, developer} — every button, eyebrow, title, date, D-day number, schedule time ≥ 3:1. (Known-fixed: --wax-ink buttons, --wax-deep accent text, dark-theme common titles.)
- D8 Custom **dark** bgColor on a light theme → is body text still readable? (known limitation).

## E. Publish & Share (publish dialog)
- E1 Publish flow: draft→published; visibility (draft/unlisted/public) clear; needs login handled gracefully.
- E2 Share link copy (feedback); KakaoTalk share (domain registered); OG/share card correct (1200×630, Korean).
- E3 QR tab: renders, center logo, "PNG로 저장" downloads a real PNG, URL shown.
- E4 Publish dialog a11y: focus trap + return, Escape.
- E5 Re-publish targets the same slug (no orphan).

## F. Guest viewer (`/preview?slug=new`, mobile) — the share-critical surface
- F1 Cover: title/date legible over photo; reveal animation plays; brand mark ok.
- F2 Scroll reveal per section (respects reduced-motion); no CLS as images load.
- F3 Share pill thumb-reachable; 카톡/링크/캘린더/참석답장 all work.
- F4 Location: 지도 buttons open the right map (카카오/네이버) with venue+address; 주소 복사 copies.
- F5 Calendar: "캘린더" downloads a valid .ics (opens native calendar on device).
- F6 Gallery: tap photo → full-screen lightbox; prev/next; counter; close (×/backdrop/Esc); scroll locked.
- F7 D-Day counts down live; date/time correct.
- F8 Account(계좌): copy button copies the number (feedback).
- F9 All 8 themes render their sections legibly (see D7).

## G. RSVP & Guestbook
- G1 Share-pill "참석 답장": name required msg; 참석/미정/불참; guests count when attending; message optional; submit → done.
- G2 RSVP **section** buttons open the same modal preselected (not just a dead highlight); editor doesn't pop the modal.
- G3 Returning guest (same browser) recognized → edit mode, no duplicate; dedupe by name.
- G4 Guestbook: submit posts; list updates; empty/loading states; friendly error (no raw DB error).
- G5 Attendee roster fills from 참석 responses; empty state gated on first load.

## H. Dashboard (`/dashboard`)
- H1 Lists the user's invitations; view count; RSVP responses table/list.
- H2 Empty state (no invitations) is friendly + routes to create.
- H3 Analytics gate: free vs premium messaging honest (scaffold — no real payment).

## I. Cross-cutting
- I1 Keyboard-only: every interactive control focusable, visible focus ring, logical order; dialogs trap.
- I2 `prefers-reduced-motion`: reveal/hover/loops disabled or reduced.
- I3 Loading/skeleton (roster/guestbook) then content; no empty-flash.
- I4 Error boundaries (`/i/[slug]/error`, root) show a branded, actionable screen.
- I5 In-app browser (KakaoTalk webview) caveats: downloads (.ics/QR/OG) + clipboard behave or degrade gracefully.
- I6 Copy consistency: fix mixed EN/KO section headers if they read as unfinished to a Korean non-designer.
