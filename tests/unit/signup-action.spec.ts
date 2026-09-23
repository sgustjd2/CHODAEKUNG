import { test, expect } from "@playwright/test";
import { signUpAction } from "@/app/login/actions";

/** signUpAction is a server action — callable directly, so the form's maxLength/required aren't a
 * boundary. Its name check runs before any DB access, so these paths need no backend. */
test("rejects a blank / whitespace-only name", async () => {
  expect(await signUpAction("a@b.co", "secret123", "   ")).toEqual({ ok: false, error: "이름을 입력해 주세요." });
});

test("rejects a name over 40 chars (form maxLength bypassed)", async () => {
  const res = await signUpAction("a@b.co", "secret123", "가".repeat(41));
  expect(res.ok).toBe(false);
  expect(!res.ok && res.error).toContain("40자");
});

test("a non-string name is a validation error, not a crash", async () => {
  const res = await signUpAction("a@b.co", "secret123", 123 as unknown as string);
  expect(res).toEqual({ ok: false, error: "이름을 입력해 주세요." });
});
