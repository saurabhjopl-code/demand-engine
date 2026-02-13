export function populateFilters(rawData) {

  const monthSelect = document.querySelectorAll(".filter-select")[0];
  const fcSelect = document.querySelectorAll(".filter-select")[1];
  const categorySelect = document.querySelectorAll(".filter-select")[2];
  const remarkSelect = document.querySelectorAll(".filter-select")[3];
  const scBandSelect = document.querySelectorAll(".filter-select")[4];

  // Clear previous
  clearSelect(monthSelect, "Month");
  clearSelect(fcSelect, "FC");
  clearSelect(categorySelect, "Category");
  clearSelect(remarkSelect, "Remark");
  clearSelect(scBandSelect, "SC Band");

  // Unique values
  const months = unique(rawData["Sales"], "Month");
  const fcs = unique(rawData["Stock"], "FC");
  const categories = unique(rawData["Style Status"], "Category");
  const remarks = unique(rawData["Style Status"], "Company Remark");

  months.forEach(v => addOption(monthSelect, v));
  fcs.forEach(v => addOption(fcSelect, v));
  categories.forEach(v => addOption(categorySelect, v));
  remarks.forEach(v => addOption(remarkSelect, v));

  // Static SC Bands (logic-based)
  const scBands = ["0–30","30–45","45–60","60–90","90–120","120+"];
  scBands.forEach(v => addOption(scBandSelect, v));
}

function unique(data, key) {
  if (!data) return [];
  return [...new Set(data.map(row => row[key]).filter(Boolean))].sort();
}

function clearSelect(select, label) {
  select.innerHTML = `<option value="">${label} ▼</option>`;
}

function addOption(select, value) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  select.appendChild(option);
}
