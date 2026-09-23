// Wait for a DOM element with an automatic timeout safety
export function waitForElement(selector: string, timeout = 5000): Promise<Element | null> {
  return new Promise(resolve => {
    const existing = document.querySelector(selector);
    if (existing) return resolve(existing);

    const timer = setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearTimeout(timer);
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}

// Clean AniList URL slug to improve TMDB query match accuracy
export function cleanAnimeTitle(rawSlug: string): string {
  return rawSlug
    .replace(/-/g, " ")
    .replace(/\b(season\s*\d+|s\d+|part\s*\d+|cour\s*\d+|\d+(?:st|nd|rd|th)\s*season)\b/gi, "")
    .replace(/\b(special(?:s)?(?:\s+episode(?:s)?)?|episode(?:s)?|eps?)\b/gi, "")
    .replace(/\b\d{4}\b/g, "")
    .replace(/\b(ii|iii|iv|v|vi)\b\s*$/i, "")
    .replace(/\b\d{1,2}\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Resolve user country code from browser locale without ES2022 .at()
export function getBrowserCountryCode(): string {
  const parts = navigator.language.split("-");
  return parts[parts.length - 1]?.toUpperCase() || "FR";
}
