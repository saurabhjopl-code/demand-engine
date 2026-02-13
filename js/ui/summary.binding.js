import { computedStore } from "../store/computed.store.js";

export function renderSummaries() {

  renderSaleDetails();
  renderStockOverview();
  renderSCBandSummary();
}

/* ======================================
   1️⃣ SALE DETAILS CARD
====================================== */

function renderSaleDetails() {

  const card = document.querySelectorAll(".summary-card")[0];
  const data = computedStore.summaries.saleDetails;

  card.innerHTML = `
    <h3>Sale Details</h3>
    <div>Total Units Sold: <strong>${data.totalUnitsSold || 0}</strong></div>
    <div>Total Days: <strong>${data.totalDays || 0}</strong></div>
    <div>Overall DRR: <strong>${data.overallDRR || 0}</strong></div>
  `;
}

/* ======================================
   2️⃣ STOCK OVERVIEW CARD
====================================== */

function renderStockOverview() {

  const card = document.querySelectorAll(".summary-card")[1];
  const data = computedStore.summaries.stockOverview;

  card.innerHTML = `
    <h3>Current FC Stock</h3>
    <div>Total Stock: <strong>${data.totalStock || 0}</strong></div>
    <div>Total Units Sold: <strong>${data.totalUnitsSold || 0}</strong></div>
    <div>Overall DRR: <strong>${data.overallDRR || 0}</strong></div>
    <div>Overall SC: <strong>${data.overallSC || 0}</strong></div>
  `;
}

/* ======================================
   3️⃣ SC BAND SUMMARY CARD
====================================== */

function renderSCBandSummary() {

  const card = document.querySelectorAll(".summary-card")[2];
  const data = computedStore.summaries.scBandSummary;

  let html = `<h3>SC Band Summary</h3>`;

  for (const band in data) {

    html += `
      <div style="margin-top:8px;">
        <strong>${band}</strong><br/>
        SKUs: ${data[band].skuCount}<br/>
        Units Sold: ${data[band].totalUnitsSold}<br/>
        Stock: ${data[band].totalStock}
      </div>
    `;
  }

  card.innerHTML = html;
}
