// Build script using esbuild
import esbuild from "esbuild";

const metadata = `// ==UserScript==
// @name         AniList Where to Watch
// @namespace    https://anilist.co/
// @version      1.0.0
// @description  Display streaming providers on AniList pages via TMDB
// @match        https://anilist.co/*
// @grant        none
// ==/UserScript==
`;

esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "dist/anilist-tmdb-streaming.user.js",
  banner: { js: metadata },
  target: "es2020",
  minify: false,
}).catch(() => process.exit(1));
