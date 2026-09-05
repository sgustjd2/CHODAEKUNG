/**
 * Resolve an image reference to a URL. Uploaded images are stored as full URLs (Supabase Storage);
 * bundled demo photos are stored as bare names under /public/assets/photos/<name>.jpg.
 */
export function photoUrl(src: string): string {
  return /^https?:\/\//.test(src) ? src : `/assets/photos/${src}.jpg`;
}
