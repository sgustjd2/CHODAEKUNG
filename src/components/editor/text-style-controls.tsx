"use client";

import type { TextStyle } from "@/lib/invitation/types";
import { FONTS } from "@/lib/invitation/fonts";
import { TEXT_SIZE_STEPS, isEmptyTextStyle } from "@/lib/invitation/text-style";

/**
 * Per-field text styling controls (size / color / font / bold / italic). Shared by the inspector
 * panel and the preview floating toolbar — one source of truth. Operates on a single field's
 * TextStyle; `onChange` merges a partial, `onReset` clears the whole field's style.
 */
export function TextStyleControls({
  value,
  onChange,
  onReset,
}: {
  value: TextStyle | undefined;
  onChange: (partial: Partial<TextStyle>) => void;
  onReset: () => void;
}) {
  const v = value ?? {};
  const curSize = v.size ?? 1;
  return (
    <div className="ts-controls">
      <div className="ts-row">
        <span className="ts-lbl">크기</span>
        <div className="radio-group">
          {TEXT_SIZE_STEPS.map((s) => (
            <button
              key={s.value}
              type="button"
              className={`radio-btn${curSize === s.value ? " active" : ""}`}
              onClick={() => onChange({ size: s.value })}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="ts-row">
        <span className="ts-lbl">색상</span>
        <div className="ts-color">
          <input
            type="color"
            aria-label="글자 색상"
            value={v.color ?? "#333333"}
            onChange={(e) => onChange({ color: e.target.value })}
          />
          <button type="button" className="ts-mini" onClick={() => onChange({ color: undefined })}>
            기본색
          </button>
        </div>
      </div>

      <div className="ts-row">
        <span className="ts-lbl">글꼴</span>
        <select
          className="insp-input ts-font"
          aria-label="글꼴"
          value={v.font ?? "pretendard"}
          onChange={(e) => onChange({ font: e.target.value === "pretendard" ? undefined : e.target.value })}
        >
          {FONTS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div className="ts-row">
        <span className="ts-lbl">스타일</span>
        <div className="radio-group">
          <button type="button" className={`radio-btn${v.bold ? " active" : ""}`} style={{ fontWeight: 800 }} onClick={() => onChange({ bold: !v.bold })}>
            굵게
          </button>
          <button type="button" className={`radio-btn${v.italic ? " active" : ""}`} style={{ fontStyle: "italic" }} onClick={() => onChange({ italic: !v.italic })}>
            기울임
          </button>
        </div>
      </div>

      {!isEmptyTextStyle(value) && (
        <button type="button" className="ts-reset" onClick={onReset}>
          이 문구 스타일 초기화
        </button>
      )}
    </div>
  );
}
