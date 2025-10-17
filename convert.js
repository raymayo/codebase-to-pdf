const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const hljs = require("highlight.js");

const SOURCE_DIR = "./src";
const OUTPUT_DIR = "./pdfs";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "all-src-3col.pdf");

// ✅ tune these:
const EXTENSIONS = new Set([
  ".js", ".jsx", ".ts", ".tsx",
  ".json", ".md", ".css", ".scss",
  ".html", ".yml", ".yaml"
]);
const IGNORE_DIRS = new Set([
  "node_modules", ".git", "build", "dist", ".next", "out", "coverage", ".turbo", ".cache"
]);
const MAX_FILE_BYTES = 200 * 1024; // skip files > 200KB

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function shouldIgnore(filePath) {
  const parts = filePath.split(path.sep);
  if (parts.some(p => IGNORE_DIRS.has(p))) return true;

  const ext = path.extname(filePath).toLowerCase();
  if (!EXTENSIONS.has(ext)) return true;

  try {
    const { size } = fs.statSync(filePath);
    if (size > MAX_FILE_BYTES) return true;
  } catch (_) { }
  return false;
}

function getAllFiles(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.has(f)) files = files.concat(getAllFiles(p));
    } else {
      if (!shouldIgnore(p)) files.push(p);
    }
  }
  return files;
}

function guessLanguage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".ts":
    case ".tsx": return "typescript";
    case ".js":
    case ".jsx": return "javascript";
    case ".json": return "json";
    case ".css":
    case ".scss": return "css";
    case ".html": return "xml";
    case ".md": return "markdown";
    case ".yml":
    case ".yaml": return "yaml";
    default: return "plaintext";
  }
}

(async () => {
  const browser = await puppeteer.launch({ args: ["--no-sandbox", "--font-render-hinting=none"] });
  const page = await browser.newPage();
  await page.emulateMediaType("screen");

  const files = getAllFiles(SOURCE_DIR);
  console.log(`📄 Packing ${files.length} files into a single 3-column PDF...\n`);

  // Build one big HTML that flows continuously in columns
  let sections = "";
  for (const filePath of files) {
    const rel = path.relative(SOURCE_DIR, filePath);
    const content = fs.readFileSync(filePath, "utf8");
    const language = guessLanguage(filePath);
    let highlighted;
    try {
      highlighted = hljs.highlight(content, { language }).value;
    } catch {
      highlighted = hljs.highlightAuto(content).value;
    }

    // NOTE: No column-span here (to avoid resetting columns)
    sections += `
      <section class="file">
        <div class="file-title">${rel}</div>
        <pre><code class="hljs">${highlighted}</code></pre>
      </section>
    `;
  }

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <style>
      @page { size: A4 landscape; margin: 8mm; }
      html, body { padding: 0; margin: 0; }
      body {
        font-family: 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
        background: #ffffff; color: #24292e;
      }
      .wrap { padding: 8mm; padding-top: 6mm; }

      /* Continuous 3-column flow to use all leftover space */
      .columns {
        column-count: 3;
        column-gap: 8mm;
        column-fill: auto; /* fill left-to-right; no balancing gaps */
      }

      /* Compact, inline filename that does NOT span columns */
      .file-title {
        font-weight: 700;
        font-size: 10px;
        color: #1b1f23;
        margin: 0 0 4px 0;
        border-bottom: 1px solid #e1e4e8;
        padding-bottom: 2px;
        /* Keep it in-flow to avoid column resets */
        break-before: auto;
        break-after: avoid-column; /* try to keep title with its code start */
      }

      /* Each file is just normal flow content; allow breaking inside to avoid big gaps */
      .file {
        break-inside: auto;         /* allow content to split across columns/pages */
        page-break-inside: auto;
        margin: 0 0 10px 0;
      }

      pre {
        margin: 0;
        border-radius: 4px;
        background: transparent;
        white-space: pre-wrap;      /* wrap long lines to avoid horizontal overflow */
        overflow-wrap: anywhere;    /* permit breaks in long tokens */
        word-break: normal;
        break-inside: auto;         /* allow column/page splits inside big blocks */
        page-break-inside: auto;
      }

      code {
        font-family: inherit;
        font-size: 10px;            /* compact */
        line-height: 1.25;          /* compact */
        display: block;
      }

      /* Optional: slightly denser look for markdown paragraphs if present */
      .hljs p { margin: 0; }

      /* GitHub-lightish highlighting */
      .hljs { color: #24292e; background: transparent; }
      .hljs-keyword, .hljs-selector-tag, .hljs-literal, .hljs-section, .hljs-link { color: #005cc5; }
      .hljs-function .hljs-title, .hljs-title.class_, .hljs-title.function_ { color: #6f42c1; }
      .hljs-attr, .hljs-name, .hljs-variable, .hljs-template-variable { color: #e36209; }
      .hljs-string, .hljs-meta .hljs-string, .hljs-regexp, .hljs-addition, .hljs-attribute, .hljs-symbol, .hljs-bullet { color: #032f62; }
      .hljs-number, .hljs-deletion { color: #005cc5; }
      .hljs-comment, .hljs-quote { color: #6a737d; font-style: italic; }
      .hljs-meta { color: #22863a; }
      .hljs-emphasis { font-style: italic; }
      .hljs-strong { font-weight: 600; }

      :root { tab-size: 2; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="columns">
        ${sections}
      </div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: "load" });
  await page.pdf({
    path: OUTPUT_FILE,
    printBackground: false,
    preferCSSPageSize: true,
    scale: 0.85
  });

  await browser.close();
  console.log(`\n🎉 Done! Wrote: ${OUTPUT_FILE}`);
})();
