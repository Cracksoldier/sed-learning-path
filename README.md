# sed — Learning Path

An interactive, self-paced learning path for the Unix `sed` stream editor, from beginner to expert. Runs entirely in the browser with no build step or server required.

## Features

- **4 progressive tiers** — Beginner, Intermediate, Advanced, Expert
- **20 topics** with explanations, code examples, and curated resource links
- **20 challenges** with optional hints and per-tier progress bars
- **Overall progress bar** tracking completion across all tiers
- **Persistent progress** via localStorage — survives page reloads
- **Export / Import** — save your progress as a JSON file and restore it on any device
- **No dependencies** — vanilla HTML, CSS, and JavaScript; hostable on GitHub Pages

## Usage

Open `index.html` directly in a browser, or serve it locally:

```sh
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

## GitHub Pages

Push the repository to GitHub and enable Pages from the repository settings (source: `main` branch, root `/`). No build or configuration file needed.

## What you'll learn

| Tier | Topics |
|------|--------|
| **Beginner** | What sed is, substitution (`s/old/new/`), flags (`g`, `i`, nth), print (`-n`, `p`), delete (`d`) |
| **Intermediate** | Address ranges, negation (`!`), multiple commands (`-e`), in-place editing (`-i`), `a`/`i`/`c`, grouping |
| **Advanced** | Hold space (`h H g G x`), multi-line (`N P D`), branching (`b t T` + labels), file I/O (`r`/`w`), extended regex (`-E`) |
| **Expert** | Script files, pipeline composition, performance, real-world patterns, debugging |

## Progress export format

Progress is stored and exported as a plain JSON file:

```json
{
  "version": 1,
  "lastUpdated": "2026-05-22T00:00:00.000Z",
  "tiers": {
    "tier-1": {
      "collapsed": false,
      "challenges": { "c1-1": true, "c1-2": false }
    }
  }
}
```

Import the file on any device using the **Import Progress** button to resume where you left off.
