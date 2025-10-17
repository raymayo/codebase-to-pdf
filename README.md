# Source → Single PDF (Portrait, Multi-Column)

This script recursively scans a source directory (default: `./src`) and merges all matching files into **one compact PDF** using a **multi-column A4 portrait layout** with syntax highlighting.  
It minimizes wasted space by **flowing files continuously** — no page breaks between them.

---

## 🧱 1. Prerequisites

- **Node.js** 16+ (18+ recommended)
- Internet access on first install (Puppeteer downloads Chromium automatically)

If you’re in a restricted environment, see [Using a system Chrome/Chromium](#using-a-system-chromechromium).

---

## 📦 2. Install Dependencies

```bash
# Install required packages
npm i puppeteer highlight.js
```

---

## ⚙️ 3. How to Use

1. **Add source files**  
   Put all files you want to convert into the `./src` folder.

2. **Run the script**

   ```bash
   node convert
   ```

3. **View the result**  
   The merged PDF will appear at:
   ```
   ./pdfs/all-src-portrait-3col.pdf
   ```

---

## 🖨️ Output

- Default output: `./pdfs/all-src-portrait-3col.pdf`
- Change via `OUTPUT_FILE` constant

---

## 🧠 How It Works

1. Recursively scans `SOURCE_DIR`, skipping ignored and large files
2. Uses `highlight.js` to colorize code
3. Combines everything into one continuous HTML file
4. Renders to PDF via Puppeteer using an A4 multi-column layout

---

## 📜 License

Use freely within your own projects.  
Add a license file if redistributing.

---
