Here’s a ready-to-drop **README.md** for your script.

````md
# Source → Single PDF (Portrait, Multi-Column)

This script walks a source directory (default: `./src`) and packs all matching files into **one compact PDF** using **3-column (or 2-column) portrait layout** with syntax highlighting. It **reuses leftover space**—no page breaks between files—so you get far fewer pages than one-file-per-PDF.

---

## Features

- 🧭 Recursive scan of `./src` (configurable)
- 🧹 Skips common heavy dirs (e.g. `node_modules`, `.git`) and big files by size
- 🖨️ A4 portrait, multi-column flow (no wasted whitespace between files)
- 🖍️ Syntax highlighting via `highlight.js`
- ⚙️ Easy knobs for column count, margins, font size, scale, and more

---

## Prerequisites

- **Node.js** 16+ (18+ recommended)
- Internet access on first install (Puppeteer downloads Chromium by default)

If you’re in a restricted environment, see **[Using a system Chrome/Chromium](#using-a-system-chromechromium)**.

---

## Install

```bash
# From your project root
npm init -y

# Add dependencies
npm i puppeteer highlight.js
```
````

Place your script file (e.g. `make-pdf.js`) in the project root and paste the code you have.

Add a run script to `package.json` (optional but handy):

```json
{
	"scripts": {
		"pdf": "node make-pdf.js"
	}
}
```

---

## Quick start

1. Put the source files you want to include under `./src` (or change `SOURCE_DIR`).

2. Run:

   ```bash
   node make-pdf.js
   # or
   npm run pdf
   ```

3. Find the output at: `./pdfs/all-src-portrait-3col.pdf`

---

## Configuration

Open the script and adjust the top-level constants as needed:

### What to include / skip

- **`SOURCE_DIR`**: root folder to scan (default `./src`)
- **`EXTENSIONS`**: whitelist of file extensions to include
- **`IGNORE_DIRS`**: directory names to ignore (e.g. `node_modules`, `.git`, `dist`)
- **`MAX_FILE_BYTES`**: skip files larger than this (default **200 KB**)

### Layout & density

Inside the HTML/CSS template:

- **Columns**
  Your current code has:

  ```css
  .columns {
  	column-count: 2; /* change to 3 for three columns */
  	column-gap: 8mm;
  	column-fill: auto;
  }
  ```

  - To **use three columns**, set `column-count: 3`.
  - Or let the browser decide while targeting a width:

    ```css
    .columns {
    	column-count: auto;
    	column-width: 62mm;
    	column-gap: 8mm;
    }
    ```

- **Page size & margins**

  ```css
  @page {
  	size: A4;
  	margin: 0mm;
  }
  .wrap {
  	padding: 8mm;
  }
  ```

  This yields an **effective 8 mm margin** via the inner `.wrap`. Increase `.wrap` padding (or the `@page` margin) if you need bigger margins.

- **Font & scale**
  Tighter settings reduce page count:

  ```css
  code {
  	font-size: 9.5px;
  	line-height: 1.22;
  }
  ```

  And in `page.pdf({ scale: 0.9 })`, smaller scale packs more per page (e.g. `0.85`).

- **Line wrapping**
  Already optimized for columns:

  ```css
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  ```

  This prevents long tokens from blowing out the column width.

---

## Output

- Target file: `./pdfs/all-src-portrait-3col.pdf`
  Change with `OUTPUT_FILE` at the top of the script.

---

## How it works

1. Recursively collects matching files under `SOURCE_DIR`, skipping large files and ignored folders.
2. Uses `highlight.js` to syntax-highlight code.
3. Concatenates all files into **one HTML document** with a compact, inline file header and a single multi-column flow.
4. Prints to A4 portrait PDF using Puppeteer (Chromium).

Because everything is one continuous flow, the next file starts **immediately** after the previous one—no wasted space.

---

## Tips & common tweaks

- **Want landscape instead?**
  Change:

  ```css
  @page {
  	size: A4 landscape;
  	margin: 0mm;
  }
  ```

  And consider bumping `column-count` to `3` with slightly larger `font-size` (e.g. 10px).

- **Need fewer pages fast?**

  - `code { font-size: 9px; line-height: 1.2; }`
  - `scale: 0.85`
  - Lower `column-gap` (e.g. `6mm`)

- **Prefer visual balance over maximum packing?**
  Use `column-fill: balance;` (may add a page but looks neater).

- **Chunk huge repos into volumes**
  If HTML gets too large (very big repos), split `files` into batches of N and emit `all-src-portrait-3col-part-001.pdf`, etc.

---

## Using a system Chrome/Chromium

If your environment blocks the Chromium download or you already have Chrome:

```bash
PUPPETEER_SKIP_DOWNLOAD=1 npm i puppeteer
```

Then run with:

- **Linux/macOS**

  ```bash
  PUPPETEER_EXECUTABLE_PATH="$(which chromium || which google-chrome || which chromedriver || true)" node make-pdf.js
  ```

- **Windows (PowerShell)**

  ```powershell
  setx PUPPETEER_EXECUTABLE_PATH "C:\Program Files\Google\Chrome\Application\chrome.exe"
  node make-pdf.js
  ```

---

## Troubleshooting

- **Blank or missing fonts**: ensure a monospace font is available (the stack includes system fallbacks).
- **“No usable sandbox!” on Linux CI**: keep `--no-sandbox` (already set) or configure a proper user namespace.
- **Highlighting errors**: the script tries a best-effort `highlight()` and falls back to `highlightAuto()`.
- **Too few columns**: double-check `column-count` (your snippet currently sets **2** but comments say 3).

---

## License

Use freely within your project. Add a license file if you plan to redistribute.

```

> **Heads-up:** In your pasted code, the comment says “force 3 columns” but `column-count` is set to **2**. If you truly want three, change it to `3`.
```
