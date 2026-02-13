import { computedStore } from "../store/computed.store.js";

export function renderSummaries() {

  const cards = document.querySelectorAll(".summary-card");
  if (!cards || cards.length < 4) return;

  renderSaleDetails(cards[0]);
  renderStockOverview(cards[1]);
  renderSCBand(cards[2]);
  renderSizeWise(cards[3]); // ✅ SIZE-WISE
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
      <tbody>
        ${rowsHTML}
      </tbody>
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
      <tbody>
        ${rowsHTML}
      </tbody>
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
      <tbody>
        ${rowsHTML}
      </tbody>
    </table>
  `;
}

/* ==========================================
   4️⃣ SIZE-WISE ANALYSIS
========================================== */

function renderSizeWise(card) {

  const rows = computedStore.summaries.sizeWise;
  if (!rows) return;

  let rowsHTML = "";

  rows.forEach(row => {
    rowsHTML += `
      <tr>
        <td>${row.size}</td>
        <td>${row.category}</td>
        <td>${format(row.unitsSold)}</td>
        <td>${format(row.totalUnits)}</td>
        <td>${row.sizeShare}%</td>
        <td>${format(row.unitsInStock)}</td>
        <td>${format(row.totalStock)}</td>
      </tr>
    `;
  });

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
          <th>Units in Stock</th>
          <th>Total Stock</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHTML}
      </tbody>
    </table>
  `;
}

/* ==========================================
   FORMATTER
========================================== */

function format(value) {
  return Number(value || 0).toLocaleString("en-IN");
}
