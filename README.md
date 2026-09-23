# AniList-where-to-watch

A userscript to help you find where you can watch your anime on AniList

## Installation

Download the latest release from the [releases page](https://github.com/OGjerome/anilist-where-to-watch/releases).

The userscript was tested with [Violentmonkey](https://violentmonkey.github.io/), but it should also work with [Tampermonkey](https://www.tampermonkey.net/).

## Features

- Injects available streaming platforms (Crunchyroll, Netflix, ADN, Prime Video, etc.) directly into AniList.
- Dynamic country selector with local storage persistence.
- Automatic cleaning of title slugs (removes season, part, cour, and release year tags).
- Fallback redirection to TMDB/JustWatch when direct search is unavailable.

## Development

```
npm install
npm run build
```

## Building

```
npm run build
```
