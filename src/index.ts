import { STORAGE_COUNTRY_KEY } from "./constants";
import { fetchWatchProviders, searchAnime } from "./tmdb";
import { renderStreamingWidget } from "./ui";
import { cleanAnimeTitle, getBrowserCountryCode } from "./utils";

// Main controller function
async function checkAndRender(): Promise<void> {
  if (!window.location.pathname.includes("/anime/")) return;

  const rawSlug = window.location.pathname.split("/")[3];
  if (!rawSlug) return;

  const cleanTitle = cleanAnimeTitle(rawSlug);
  const searchResult = await searchAnime(cleanTitle);

  if (!searchResult?.id) {
    await renderStreamingWidget(undefined, cleanTitle, checkAndRender);
    return;
  }

  const mediaType = searchResult.media_type === "movie" ? "movie" : "tv";
  const providersData = await fetchWatchProviders(searchResult.id, mediaType);

  const savedCountry = localStorage.getItem(STORAGE_COUNTRY_KEY);
  const country = savedCountry || getBrowserCountryCode();
  const countryData = providersData?.results?.[country];

  await renderStreamingWidget(countryData, cleanTitle, checkAndRender);
}

// Initial run
checkAndRender();

// Observe Single Page Application (SPA) navigation
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    setTimeout(checkAndRender, 500);
  }
}).observe(document, { subtree: true, childList: true });
