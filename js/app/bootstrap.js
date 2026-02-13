import { fetchSheet } from "../data/fetch.service.js";
import { parseCSV } from "../data/parser.service.js";
import { validateHeaders } from "../data/validator.service.js";
import { dataStore } from "../store/data.store.js";

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

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const sheetInfo = document.getElementById("sheetInfo");

async function loadSheets() {
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
}

function updateSheetInfo(name, count) {
  const current = sheetInfo.textContent;
  const updated = current.replace(
    new RegExp(`${name}:\\s*\\d+`),
    `${name}: ${count}`
  );
  sheetInfo.textContent = updated;
}

loadSheets();
