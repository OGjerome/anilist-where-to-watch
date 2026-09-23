import { STORAGE_COUNTRY_KEY, TMDB_IMAGE_BASE_URL } from "./constants";
import { fetchCountries } from "./tmdb";
import { TmdbCountryData, TmdbProvider } from "./types";
import { getBrowserCountryCode, waitForElement } from "./utils";

// Resolve target search URL based on platform provider
function getPlatformSearchUrl(providerName: string, title: string, fallbackUrl: string): string {
  const words = title.split(" ");
  const queryRaw = words.length > 5 ? words.slice(0, 4).join(" ") : title;
  const query = encodeURIComponent(queryRaw);
  const normalized = providerName.toLowerCase();

  switch (true) {
    case normalized.includes("crunchyroll"):
      return `https://www.crunchyroll.com/search?q=${query}`;
    case normalized.includes("netflix"):
      return `https://www.netflix.com/search?q=${query}`;
    case normalized.includes("prime video") || normalized.includes("amazon"):
      return `https://www.amazon.com/s?k=${query}&i=instant-video`;
    case normalized.includes("disney"):
      return `https://www.disneyplus.com/search?q=${query}`;
    case normalized.includes("hulu"):
      return `https://www.hulu.com/search?q=${query}`;
    case normalized.includes("max") || normalized.includes("hbo"):
      return `https://play.max.com/search?q=${query}`;
    case normalized.includes("apple tv"):
      return `https://tv.apple.com/search?term=${query}`;
    case normalized.includes("animation digital network") || normalized.includes("adn"):
      return "https://animationdigitalnetwork.fr/video";
    case normalized.includes("canal"):
      return `https://www.canalplus.com/recherche/${query}`;
    case normalized.includes("bilibili"):
      return `https://www.bilibili.tv/en/search-result?q=${query}`;
    case normalized.includes("iqiyi"):
      return `https://www.iq.com/search?keyword=${query}`;
    case normalized.includes("hidive"):
      return `https://www.hidive.com/search?q=${query}`;
    default:
      return fallbackUrl;
  }
}

// Render dynamic streaming provider badges
function renderProvidersList(
  wrapper: HTMLElement,
  countryData: TmdbCountryData | undefined,
  animeTitle: string
): void {
  let list = wrapper.querySelector("#tmdb-providers-list") as HTMLDivElement;
  if (!list) {
    list = document.createElement("div");
    list.id = "tmdb-providers-list";
    list.style.display = "flex";
    list.style.flexWrap = "wrap";
    list.style.gap = "6px";
    list.style.marginTop = "4px";
    wrapper.appendChild(list);
  }

  list.innerHTML = "";

  if (!countryData) {
    const emptyNotice = document.createElement("span");
    emptyNotice.style.fontSize = "12px";
    emptyNotice.style.color = "#8ba0b2";
    emptyNotice.textContent = "No streaming available";
    list.appendChild(emptyNotice);
    return;
  }

  const allProviders: TmdbProvider[] = [
    ...(countryData.flatrate || []),
    ...(countryData.ads || []),
    ...(countryData.free || [])
  ];

  const uniqueProviders = allProviders.filter(
    (provider, index, array) => array.findIndex(item => item.provider_id === provider.provider_id) === index
  );

  for (const provider of uniqueProviders) {
    const link = document.createElement("a");
    link.href = getPlatformSearchUrl(provider.provider_name, animeTitle, countryData.link);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = provider.provider_name;
    link.style.display = "flex";
    link.style.alignItems = "center";
    link.style.gap = "6px";
    link.style.padding = "4px 8px";
    link.style.borderRadius = "4px";
    link.style.background = "#151f2e";
    link.style.color = "#bcbedc";
    link.style.fontSize = "12px";
    link.style.textDecoration = "none";

    if (provider.logo_path) {
      const img = document.createElement("img");
      img.src = `${TMDB_IMAGE_BASE_URL}${provider.logo_path}`;
      img.alt = provider.provider_name;
      img.style.width = "20px";
      img.style.height = "20px";
      img.style.borderRadius = "3px";
      link.appendChild(img);
    }

    const label = document.createElement("span");
    label.textContent = provider.provider_name;
    link.appendChild(label);

    list.appendChild(link);
  }
}

// Render the main widget containing the selector and provider list
export async function renderStreamingWidget(
  countryData: TmdbCountryData | undefined,
  animeTitle: string,
  onCountryChange: () => Promise<void>
): Promise<void> {
  const targetContainer = await waitForElement(".rankings");
  if (!targetContainer) return;

  let wrapper = document.querySelector("#tmdb-streaming-container") as HTMLDivElement;
  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.id = "tmdb-streaming-container";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.justifyContent = "flex-start";
    wrapper.style.gap = "10px";
    wrapper.style.margin = "10px 0";
    targetContainer.insertAdjacentElement("afterbegin", wrapper);
  }

  const savedCountry = localStorage.getItem(STORAGE_COUNTRY_KEY);
  const currentCountry = savedCountry || getBrowserCountryCode();

  let select = wrapper.querySelector("#tmdb-country-selector") as HTMLSelectElement;
  if (!select) {
    select = document.createElement("select");
    select.id = "tmdb-country-selector";
    select.style.padding = "6px 10px";
    select.style.borderRadius = "4px";
    select.style.background = "#151f2e";
    select.style.color = "#bcbedc";
    select.style.border = "none";
    select.style.maxWidth = "160px";
    select.style.width = "100%";
    select.style.textOverflow = "ellipsis";
    select.style.whiteSpace = "nowrap";
    select.style.overflow = "hidden";

    const countries = await fetchCountries();
    for (const country of countries) {
      const option = document.createElement("option");
      option.value = country.iso_3166_1;
      const label = country.english_name.length > 15 ? `${country.english_name.slice(0, 15)}...` : country.english_name;
      option.textContent = `${label} (${country.iso_3166_1})`;
      if (country.iso_3166_1 === currentCountry) option.selected = true;
      select.appendChild(option);
    }

    select.addEventListener("change", async event => {
      const target = event.target as HTMLSelectElement;
      localStorage.setItem(STORAGE_COUNTRY_KEY, target.value);
      await onCountryChange();
    });

    wrapper.appendChild(select);
  } else {
    select.value = currentCountry;
  }

  renderProvidersList(wrapper, countryData, animeTitle);
}
