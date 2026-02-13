import { fetchSheet } from "../data/fetch.service.js";
import { parseCSV } from "../data/parser.service.js";
import { validateHeaders } from "../data/validator.service.js";
import { dataStore } from "../store/data.store.js";
import { populateFilters } from "../ui/filter.populate.js";

/* ================================
   FUTURE ENGINE INITIALIZER
   (Safe extension – does nothing if file not yet created)
================================ */
let initializeEngine = () => {};
try {
  const module = await import("../engine/engine.init.js");
  initializeEngine = module.initializeEngine || (() => {});
} catch (e) {
  // Engine not yet created – safe ignore
}

/* ================================
   SHEET CONFIGURATION
================================ */

const SHEETS = [
  {
    name: "Sales",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9UMGb9GMFpOrcTTV1yeN4VLudTFeVy97_09T7-SIyvXDsMFypBgqyZWVQitbJi0I5IenBb0skv9UQ/pub?gid=928000883&single=true&output=csv"
  },
  {
    name: "Stock",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9UMGb9GMFpOrcTTV1yeN4VLudTFeVy97_09T7-SIyvXDsMFypBgqyZWVQitbJi0I5IenBb0skv9UQ/pub?gid=1380535833&single=true&output=csv"
  },
  {
    name: "Style Status",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9UMGb9GMFpOrcTTV1yeN4VLudTFeVy97_09T7-SIyvXDsMFypBgqyZWVQitbJi0I5IenBb0skv9UQ/pub?gid=9418502&single=true&output=csv"
  },
  {
    name: "Sale Days",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9UMGb9GMFpOrcTTV1yeN4VLudTFeVy97_09T7-SIyvXDsMFypBgqyZWVQitbJi0I5IenBb0skv9UQ/pub?gid=46718869&single=true&output=csv"
  },
  {
    name: "Size Count",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9UMGb9GMFpOrcTTV1yeN4VLudTFeVy97_09T7-SIyvXDsMFypBgqyZWVQitbJi0I5IenBb0skv9UQ/pub?gid=1368985173&single=true&output=csv"
  },
  {
    name: "Production",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9UMGb9GMFpOrcTTV1yeN4VLudTFeVy97_09T7-SIyvXDsMFypBgqyZWVQitbJi0I5IenBb0skv9UQ/pub?gid=1281323624&single=true&output=csv"
  },
  {
    name: "Meter Calc",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9UMGb9GMFpOrcTTV1yeN4VLudTFeVy97_09T7-SIyvXDsMFypBgqyZWVQitbJi0I5IenBb0skv9UQ/pub?gid=474570014&single=true&output=csv"
  },
  {
    name: "Location",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9UMGb9GMFpOrcTTV1yeN4VLudTFeVy97_09T7-SIyvXDsMFypBgqyZWVQitbJi0I5IenBb0skv9UQ/pub?gid=701072053&single=true&output=csv"
  },
  {
    name: "X Mark Up",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9UMGb9GMFpOrcTTV1yeN4VLudTFeVy97_09T7-SIyvXDsMFypBgqyZWVQitbJi0I5IenBb0skv9UQ/pub?gid=862982464&single=true&output=csv"
  }
];

/* ================================
   UI REFERENCES
================================ */

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const sheetInfo = document.getElementById("sheetInfo");
const refreshBtn = document.getElementById("refreshBtn");

/* ================================
   MAIN LOADER
================================ */

export async function loadSheets() {

  // Clear existing raw store
  dataStore.clear();

  // Reset UI progress & row counts
  resetUI();

  let completed = 0;

  for (const sheet of SHEETS) {

    const csv = await fetchSheet(sheet.url);
    const parsed = parseCSV(csv);

    validateHeaders(sheet.name, parsed.headers);

    dataStore.set(sheet.name, parsed.rows);

    updateSheetInfo(sheet.name, parsed.rows.length);

    completed++;

    const percent = Math.floor((completed / SHEETS.length) * 100);

    progressBar.style.width = percent + "%";
    progressText.textContent = percent + "%";
  }

  /* =====================================
     AFTER ALL SHEETS LOADED
  ===================================== */

  // Populate filter dropdowns
  populateFilters(dataStore.raw);

  // Initialize engine (if exists)
  initializeEngine(dataStore.raw);
}

/* ================================
   RESET UI
================================ */

function resetUI() {

  progressBar.style.width = "0%";
  progressText.textContent = "0%";

  sheetInfo.textContent =
    "Sales: 0 | Stock: 0 | Style Status: 0 | Sale Days: 0 | " +
    "Size Count: 0 | Production: 0 | Meter Calc: 0 | " +
    "Location: 0 | X Mark Up: 0";
}

/* ================================
   UPDATE SHEET ROW COUNTS
================================ */

function updateSheetInfo(name, count) {

  const regex = new RegExp(`${name}:\\s*\\d+`);

  sheetInfo.textContent =
    sheetInfo.textContent.replace(regex, `${name}: ${count}`);
}

/* ================================
   INITIAL LOAD
================================ */

loadSheets();

/* ================================
   REFRESH HANDLER
================================ */

refreshBtn.addEventListener("click", async () => {
  await loadSheets();
});
