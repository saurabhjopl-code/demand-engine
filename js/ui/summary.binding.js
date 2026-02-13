import { computedStore } from "../store/computed.store.js";

/* ======================================================
   MASTER RENDERER
====================================================== */

export function renderSummaries() {

  const cards = document.querySelectorAll(".summary-card");
  if (!cards || cards.length < 6) return;

  safeRender(() => renderSaleDetails(cards[0]));
  safeRender(() => renderStockOverview(cards[1]));
  safeRender(() => renderSCBand(cards[2]));
  safeRender(() => renderSizeWise(cards[3]));
  safeRender(() => renderCompanyRemark(cards[4]));
  safeRender(() => renderCategory(cards[5]));
}

/* ==========================================
   SAFE WRAPPER
========================================== */

function safeRender(fn) {
  try { fn(); }
  catch (err) {
    console.error("Summary Render Error:", err);
  }
}

/* ==========================================
   FORMATTER
========================================== */

function format(val) {
  return Number(val || 0).toLocaleString("en-IN");
}

/* ==========================================
   1️⃣ SALE DETAILS
========================================== */

function renderSaleDetails(card) {

  const data = computedStore.summaries.saleDetails;
  if (!data) return;

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
  if (!data) return;

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
        <td>${format(row.styleCount)}</td>
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
  if (!rows) return;

  let rowsHTML = "";
  let grandUnits = 0;
  let grandStock = 0;

  rows.forEach(row => {
    grandUnits += row.unitsSold;
    grandStock += row.unitsInStock;
  });

  rows.forEach(row => {
    rowsHTML += `
      <tr>
        <td>${row.size}</td>
        <td>${row.category}</td>
        <td>${format(row.unitsSold)}</td>
        <td>${format(grandUnits)}</td>
        <td>${row.sizeShare}%</td>
        <td>-</td>
        <td>${format(row.unitsInStock)}</td>
        <td>${format(grandStock)}</td>
      </tr>
    `;
  });

  rowsHTML += `
    <tr class="grand-row">
      <td colspan="2"><strong>Grand Total</strong></td>
      <td><strong>${format(grandUnits)}</strong></td>
      <td></td>
      <td></td>
      <td></td>
      <td><strong>${format(grandStock)}</strong></td>
      <td></td>
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
   5️⃣ COMPANY REMARK
========================================== */

function renderCompanyRemark(card) {

  const rows = computedStore.summaries.companyRemark;
  if (!rows) return;

  let rowsHTML = "";
  let totalUnits = 0;
  let totalStock = 0;

  rows
    .sort((a,b) => b.totalUnits - a.totalUnits)
    .forEach(row => {

      totalUnits += row.totalUnits;
      totalStock += row.totalStock;

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

  rowsHTML += `
    <tr class="grand-row">
      <td><strong>Grand Total</strong></td>
      <td><strong>${format(totalUnits)}</strong></td>
      <td></td>
      <td><strong>${format(totalStock)}</strong></td>
      <td></td>
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
      <tbody>${rowsHTML}</tbody>
    </table>
  `;
}

/* ==========================================
   6️⃣ CATEGORY
========================================== */

function renderCategory(card) {

  const rows = computedStore.summaries.category;
  if (!rows) return;

  let rowsHTML = "";
  let totalUnits = 0;
  let totalStock = 0;

  rows
    .sort((a,b) => b.totalUnits - a.totalUnits)
    .forEach(row => {

      totalUnits += row.totalUnits;
      totalStock += row.totalStock;

      rowsHTML += `
        <tr>
          <td>${row.category}</td>
          <td>${format(row.totalUnits)}</td>
          <td>${format(row.drr)}</td>
          <td>${format(row.totalStock)}</td>
          <td>${format(row.sc)}</td>
        </tr>
      `;
    });

  rowsHTML += `
    <tr class="grand-row">
      <td><strong>Grand Total</strong></td>
      <td><strong>${format(totalUnits)}</strong></td>
      <td></td>
      <td><strong>${format(totalStock)}</strong></td>
      <td></td>
    </tr>
  `;

  card.innerHTML = `
    <h3>Category-wise Sale</h3>
    <table class="mini-summary-table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Total Units Sold</th>
          <th>DRR</th>
          <th>Total Stock</th>
          <th>SC</th>
        </tr>
      </thead>
      <tbody>${rowsHTML}</tbody>
    </table>
  `;
}
