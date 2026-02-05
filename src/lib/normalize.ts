export function normalizeMultilineValues(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof raw === "string") {
    const text = raw.trim();
    if (!text) {
      return [];
    }

    if (!text.includes("\n")) {
      return [text];
    }

    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  return [];
}
