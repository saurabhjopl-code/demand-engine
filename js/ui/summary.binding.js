import { computedStore } from "../store/computed.store.js";

export function renderSummaries() {

  const cards = document.querySelectorAll(".summary-card");
  if (!cards || cards.length === 0) return;

  safeRender(() => renderSaleDetails(cards[0]));
  safeRender(() => renderStockOverview(cards[1]));
  safeRender(() => renderSCBand(cards[2]));
  safeRender(() => renderSizeWise(cards[3]));
  safeRender(() => renderCompanyRemark(cards[4]));
  safeRender(() => renderCategory(cards[5]));
}

/* ==========================================
   SAFE WRAPPER (Prevents Blank App)
========================================== */

function safeRender(fn) {
  try {
    if (typeof fn === "function") fn();
  } catch (err) {
    console.error("Summary render error:", err);
  }
}

/* ==========================================
   FORMATTER
========================================== */

function format(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

/* ==========================================
   1️⃣ SALE DETAILS
========================================== */

function renderSaleDetails(card) {

  if (!card) return;
  const data = computedStore.summaries?.saleDetails;
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

  if (!card) return;
  const data = computedStore.summaries?.stockOverview;
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

  if (!card) return;
  const rows = computedStore.summaries?.scBandSummary;
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
   4️⃣ SIZE-WISE
========================================== */

function renderSizeWise(card) {
  if (!card) return;
  const rows = computedStore.summaries?.sizeWise;
  if (!rows) return;

  card.innerHTML = `<h3>Size-wise Analysis</h3>`;
}

/* ==========================================
   5️⃣ COMPANY REMARK
========================================== */

function renderCompanyRemark(card) {
  if (!card) return;
  const rows = computedStore.summaries?.companyRemark;
  if (!rows) return;

  card.innerHTML = `<h3>Company Remark-wise Sale</h3>`;
}

/* ==========================================
   6️⃣ CATEGORY
========================================== */

function renderCategory(card) {
  if (!card) return;
  const rows = computedStore.summaries?.category;
  if (!rows) return;

  card.innerHTML = `<h3>Category-wise Sale</h3>`;
}
