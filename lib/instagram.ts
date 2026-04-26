export const INSTAGRAM_BASE_URL = "https://instagram.com/";
export const INSTAGRAM_USERNAME_MAX_LENGTH = 30;

export function extractInstagramUsername(url?: string | null) {
  if (!url) return "";

  return url
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .split(/[/?#]/)[0]
    .trim();
}

export function sanitizeInstagramUsername(value: string) {
  return value
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/[^a-zA-Z0-9._]/g, "")
    .slice(0, INSTAGRAM_USERNAME_MAX_LENGTH);
}

export function toInstagramUrl(username: string) {
  const sanitized = sanitizeInstagramUsername(username);
  return sanitized ? `${INSTAGRAM_BASE_URL}${sanitized}` : null;
}
