import { computedStore } from "../store/computed.store.js";

export function renderSummaries() {

  const cards = document.querySelectorAll(".summary-card");
  if (!cards || cards.length < 6) return;

  renderSaleDetails(cards[0]);
  renderStockOverview(cards[1]);
  renderSCBand(cards[2]);
  renderSizeWise(cards[3]);
  renderCompanyRemark(cards[4]);
  renderCategory(cards[5]);
}

/* ==========================================
   1️⃣ SALE DETAILS
========================================== */

function renderSaleDetails(card) {

  const data = computedStore.summaries.saleDetails;
  if (!data || !data.rows) return;

  let rowsHTML = "";

  data.rows.forEach(row => {
    rowsHTML += `
      <tr>
        <td>${row.month}</td>
        <td>${format(row.totalUnits)}</td>
        <td>${format(row.drr)}</td>
      </tr>
    `;
  });

  rowsHTML += `
    <tr class="grand-row">
      <td><strong>Grand Total</strong></td>
      <td><strong>${format(data.grandTotal.totalUnits)}</strong></td>
      <td><strong>${format(data.grandTotal.drr)}</strong></td>
    </tr>
  `;

  card.innerHTML = `
    <h3>Sale Details</h3>
    <table class="mini-summary-table">
      <thead>
        <tr>
          <th>Month</th>
          <th>Total Units Sold</th>
          <th>DRR</th>
        </tr>
      </thead>
      <tbody>${rowsHTML}</tbody>
    </table>
  `;
}

/* ==========================================
   2️⃣ CURRENT FC STOCK
========================================== */

function renderStockOverview(card) {

  const data = computedStore.summaries.stockOverview;
  if (!data || !data.rows) return;

  let rowsHTML = "";

  data.rows.forEach(row => {
    rowsHTML += `
      <tr>
        <td>${row.fc}</td>
        <td>${format(row.totalStock)}</td>
        <td>${format(row.totalUnits)}</td>
        <td>${format(row.drr)}</td>
        <td>${format(row.sc)}</td>
      </tr>
    `;
  });

  rowsHTML += `
    <tr class="grand-row">
      <td><strong>Grand Total</strong></td>
      <td><strong>${format(data.grandTotal.totalStock)}</strong></td>
      <td><strong>${format(data.grandTotal.totalUnits)}</strong></td>
      <td><strong>${format(data.grandTotal.drr)}</strong></td>
      <td><strong>${format(data.grandTotal.sc)}</strong></td>
    </tr>
  `;

  card.innerHTML = `
    <h3>Current FC Stock</h3>
    <table class="mini-summary-table">
      <thead>
        <tr>
          <th>FC</th>
          <th>Total Stock</th>
          <th>Total Units Sold</th>
          <th>DRR</th>
          <th>SC</th>
        </tr>
      </thead>
      <tbody>${rowsHTML}</tbody>
    </table>
  `;
}

/* ==========================================
   3️⃣ SC BAND SUMMARY
========================================== */

function renderSCBand(card) {

  const rows = computedStore.summaries.scBandSummary;
  if (!rows) return;

  let rowsHTML = "";

  rows.forEach(row => {
    rowsHTML += `
      <tr>
        <td>${row.band}</td>
        <td>${row.styleCount}</td>
        <td>${format(row.totalUnits)}</td>
        <td>${format(row.totalStock)}</td>
      </tr>
    `;
  });

  card.innerHTML = `
    <h3>SC Band Summary</h3>
    <table class="mini-summary-table">
      <thead>
        <tr>
          <th>SC Band</th>
          <th># of Styles</th>
          <th>Total Units Sold</th>
          <th>Total Stock</th>
        </tr>
      </thead>
      <tbody>${rowsHTML}</tbody>
    </table>
  `;
}

/* ==========================================
   4️⃣ SIZE-WISE ANALYSIS
========================================== */

function renderSizeWise(card) {

  const rows = computedStore.summaries.sizeWise;
  if (!rows || rows.length === 0) return;

  const categoryMap = {};

  rows.forEach(row => {
    if (!categoryMap[row.category]) {
      categoryMap[row.category] = [];
    }
    categoryMap[row.category].push(row);
  });

  const grandUnits = rows.reduce((sum, r) => sum + r.unitsSold, 0);
  const grandStock = rows.reduce((sum, r) => sum + r.unitsInStock, 0);

  let rowsHTML = "";

  Object.keys(categoryMap).forEach(category => {

    const catRows = categoryMap[category];
    const categoryUnits = catRows.reduce((sum, r) => sum + r.unitsSold, 0);
    const categoryStock = catRows.reduce((sum, r) => sum + r.unitsInStock, 0);

    const categoryShare = grandUnits > 0
      ? ((categoryUnits / grandUnits) * 100).toFixed(2)
      : 0;

    catRows.forEach((row, index) => {

      rowsHTML += `<tr>`;
      rowsHTML += `<td>${row.size}</td>`;

      if (index === 0)
        rowsHTML += `<td rowspan="${catRows.length}">${category}</td>`;

      rowsHTML += `<td>${format(row.unitsSold)}</td>`;

      if (index === 0)
        rowsHTML += `<td rowspan="${catRows.length}">${format(categoryUnits)}</td>`;

      rowsHTML += `<td>${row.sizeShare}%</td>`;

      if (index === 0)
        rowsHTML += `<td rowspan="${catRows.length}">${categoryShare}%</td>`;

      rowsHTML += `<td>${format(row.unitsInStock)}</td>`;

      if (index === 0)
        rowsHTML += `<td rowspan="${catRows.length}">${format(categoryStock)}</td>`;

      rowsHTML += `</tr>`;
    });
  });

  rowsHTML += `
    <tr class="grand-row">
      <td colspan="2"><strong>Grand Total</strong></td>
      <td><strong>${format(grandUnits)}</strong></td>
      <td colspan="3"></td>
      <td><strong>${format(grandStock)}</strong></td>
    </tr>
  `;

  card.innerHTML = `
    <h3>Size-wise Analysis</h3>
    <table class="mini-summary-table">
      <thead>
        <tr>
          <th>Size</th>
          <th>Category</th>
          <th>Units Sold</th>
          <th>Total Units Sold</th>
          <th>Size % Share</th>
          <th>Category % Share</th>
          <th>Units in Stock</th>
          <th>Total Stock</th>
        </tr>
      </thead>
      <tbody>${rowsHTML}</tbody>
    </table>
  `;
}

/* ==========================================
   5️⃣ COMPANY REMARK SUMMARY
========================================== */

function renderCompanyRemark(card) {

  const rows = computedStore.summaries.companyRemark;
  if (!rows) return;

  let sorted = [...rows].sort((a,b) => b.totalUnits - a.totalUnits);

  let grandUnits = 0;
  let grandStock = 0;

  let rowsHTML = "";

  sorted.forEach(row => {

    grandUnits += row.totalUnits;
    grandStock += row.totalStock;

    rowsHTML += `
      <tr>
        <td>${row.remark}</td>
        <td>${format(row.totalUnits)}</td>
        <td>${format(row.drr)}</td>
        <td>${format(row.totalStock)}</td>
        <td>${format(row.sc)}</td>
      </tr>
    `;
  });

  const grandDRR = computedStore.totalDays > 0
    ? (grandUnits / computedStore.totalDays).toFixed(2)
    : 0;

  const grandSC = grandDRR > 0
    ? Math.round(grandStock / grandDRR)
    : 0;

  rowsHTML += `
    <tr class="grand-row">
      <td><strong>Grand Total</strong></td>
      <td><strong>${format(grandUnits)}</strong></td>
      <td><strong>${format(grandDRR)}</strong></td>
      <td><strong>${format(grandStock)}</strong></td>
      <td><strong>${format(grandSC)}</strong></td>
    </tr>
  `;

  card.innerHTML = `
    <h3>Company Remark-wise Sale</h3>
    <table class="mini-summary-table">
      <thead>
        <tr>
          <th>Company Remark</th>
          <th>Total Units Sold</th>
          <th>DRR</th>
          <th>Total Stock</th>
          <th>SC</th>
        </tr>
      </thead>
