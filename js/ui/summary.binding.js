import { computedStore } from "../store/computed.store.js";

export function renderSummaries() {

  // Ensure DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderSummariesInternal);
  } else {
    renderSummariesInternal();
  }
}

function renderSummariesInternal() {

  const cards = document.querySelectorAll(".summary-card");

  if (!cards || cards.length < 3) {
    console.warn("Summary cards not found in DOM.");
    return;
  }

  renderSaleDetails(cards[0]);
  renderStockOverview(cards[1]);
  renderSCBandSummary(cards[2]);
}

/* ======================================
   1️⃣ SALE DETAILS
====================================== */

function renderSaleDetails(card) {

  const data = computedStore.summaries.saleDetails;

  card.innerHTML = `
    <h3>Sale Details</h3>
    <div>Total Units Sold: <strong>${data.totalUnitsSold || 0}</strong></div>
    <div>Total Days: <strong>${data.totalDays || 0}</strong></div>
    <div>Overall DRR: <strong>${data.overallDRR || 0}</strong></div>
  `;
}

/* ======================================
   2️⃣ STOCK OVERVIEW
====================================== */

function renderStockOverview(card) {

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
   3️⃣ SC BAND SUMMARY
====================================== */

function renderSCBandSummary(card) {

  const data = computedStore.summaries.scBandSummary;

  let html = `<h3>SC Band Summary</h3>`;

  const bandOrder = [
    "Critical",
    "RISK",
    "Healthy",
    "SAFE",
    "WATCH",
    "Overstock"
  ];

  bandOrder.forEach(band => {

    if (data[band]) {

      html += `
        <div style="margin-top:8px;">
          <strong>${band}</strong><br/>
          SKUs: ${data[band].skuCount}<br/>
          Units Sold: ${data[band].totalUnitsSold}<br/>
          Stock: ${data[band].totalStock}
        </div>
      `;
    }
  });

  card.innerHTML = html;
}
