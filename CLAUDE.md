# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the app

No build step. Open `index.html` directly in a browser, or serve it locally:

```sh
python3 -m http.server 8080   # then visit http://localhost:8080
# or
npx serve .
```

There are no tests, no linter, and no package.json.

## Architecture

The app is three files loaded in order:

1. **`js/content.js`** — defines a single global `const LEARNING_PATH`, an array of tier objects. No logic, no imports.
2. **`js/app.js`** — IIFE that reads `LEARNING_PATH` and owns everything else: state, rendering, events, import/export.
3. **`css/style.css`** — all styling via CSS custom properties on `:root`. No framework.

`index.html` is a static shell — the only hardcoded DOM is the sticky header. `<main id="app">` is populated entirely by `app.js`.

### Data flow

```
LEARNING_PATH (content.js)
  → defaultState() builds the initial progress shape from it
  → loadState() reads localStorage, calls migrateState() to backfill any new content
  → renderApp() walks LEARNING_PATH + state to build the DOM
  → checkbox change / collapse click → mutate state → saveState() → updateAllProgress()
```

Progress is never recomputed from the DOM — always from `state.tiers[tierId].challenges`.

### Adding content

Edit only `js/content.js`. The app derives its full DOM and default state from `LEARNING_PATH` at runtime, so adding a tier, topic, or challenge there requires no changes to `app.js`. New challenge IDs default to `false` in `migrateState()`, so existing exports remain valid.

### Progress schema (localStorage key: `sed-learning-path-progress`)

```json
{
  "version": 1,
  "lastUpdated": "<ISO string>",
  "tiers": {
    "tier-1": {
      "collapsed": false,
      "topics": { "t1-what-is-sed": { "collapsed": false } },
      "challenges": { "c1-1": true, "c1-2": false }
    }
  }
}
```

`migrateState()` backfills missing keys when content is added, so the `version` field exists for future breaking changes.

### DOM conventions

- All DOM is built with `createElement` + `textContent`. No `innerHTML` for dynamic data.
- Progress bars are updated in place via `document.getElementById` — no re-render on checkbox toggle.
- Event handling is fully delegated from `#app` (one click listener, one change listener).
- Element IDs follow the pattern `tier-fill-<tierId>`, `tier-pct-<tierId>`, `ch-fill-<tierId>`, `ch-pct-<tierId>` — these are what `updateAllProgress()` targets.

### CSS

All colors and spacing use custom properties from `:root`. Tier accent colors are `--tier-1-color` through `--tier-4-color`. A future dark/light toggle would be a single class swap on `<html data-theme>`. Mobile breakpoint is 640px.
