import { test, expect, type Page } from "@playwright/test";
import { shrinkForUpload } from "@/lib/image-shrink";

/**
 * shrinkForUpload in a real browser (canvas decode/encode can't be unit-tested in Node). The function is
 * self-contained, so its exact source is injected into a blank page; the upload itself needs a backend,
 * but this is the whole transform uploadPhoto applies before it.
 */
async function setup(page: Page) {
  await page.goto("about:blank");
  await page.addScriptTag({ content: `window.__shrink = ${shrinkForUpload.toString()};` });
}

/** Encode a w×h photo-like image (noisy gradient, so JPEG can't trivially compress it) as a File. */
function makeImage(page: Page, w: number, h: number, type: string, name: string, quality = 0.95) {
  return page.evaluate(
    async ({ w, h, type, name, quality }) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d")!;
      const img = ctx.createImageData(w, h);
      for (let i = 0; i < img.data.length; i += 4) {
        const p = i / 4;
        img.data[i] = ((p % w) / w) * 255 + Math.random() * 60;
        img.data[i + 1] = (Math.floor(p / w) / h) * 255 + Math.random() * 60;
        img.data[i + 2] = Math.random() * 255;
        img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      const blob: Blob = await new Promise((r) => c.toBlob((b) => r(b!), type, quality));
      (window as unknown as { __file: File }).__file = new File([blob], name, { type });
      return blob.size;
    },
    { w, h, type, name, quality },
  );
}

async function shrinkCurrent(page: Page) {
  return page.evaluate(async () => {
    const win = window as unknown as { __file: File; __shrink: (f: File) => Promise<File> };
    const out = await win.__shrink(win.__file);
    const bmp = await createImageBitmap(out);
    return { same: out === win.__file, size: out.size, type: out.type, name: out.name, w: bmp.width, h: bmp.height };
  });
}

test("a large camera JPEG is downscaled to a 2048px long edge and gets much smaller", async ({ page }) => {
  await setup(page);
  const before = await makeImage(page, 4000, 3000, "image/jpeg", "IMG_0001.jpeg");
  const out = await shrinkCurrent(page);
  expect(out.same).toBe(false);
  expect([out.w, out.h]).toEqual([2048, 1536]);
  expect(out.type).toBe("image/jpeg");
  expect(out.name).toBe("IMG_0001.jpg");
  expect(out.size).toBeLessThan(before / 2);
});

test("portrait photos keep their orientation (long edge is the height)", async ({ page }) => {
  await setup(page);
  await makeImage(page, 3000, 4000, "image/jpeg", "portrait.jpg");
  const out = await shrinkCurrent(page);
  expect([out.w, out.h]).toEqual([1536, 2048]);
});

test("a small JPEG is left untouched", async ({ page }) => {
  await setup(page);
  await makeImage(page, 800, 600, "image/jpeg", "small.jpg", 0.8);
  const out = await shrinkCurrent(page);
  expect(out.same).toBe(true);
});

test("PNG (may carry transparency) is left untouched even when large", async ({ page }) => {
  await setup(page);
  await makeImage(page, 3000, 2000, "image/png", "logo.png");
  const out = await shrinkCurrent(page);
  expect(out.same).toBe(true);
  expect(out.type).toBe("image/png");
});
