import { computedStore } from "../store/computed.store.js";

export function renderSummaries() {

  const cards = document.querySelectorAll(".summary-card");
  if (!cards || cards.length < 3) return;

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
    <table class="mini-summary-table">
      <tr>
        <td>Total Units Sold</td>
        <td><strong>${formatNumber(data.totalUnitsSold)}</strong></td>
      </tr>
      <tr>
        <td>Total Days</td>
        <td><strong>${data.totalDays}</strong></td>
      </tr>
      <tr>
        <td>Overall DRR</td>
        <td><strong>${formatNumber(data.overallDRR)}</strong></td>
      </tr>
    </table>
  `;
}

/* ======================================
   2️⃣ STOCK OVERVIEW
====================================== */

function renderStockOverview(card) {

  const data = computedStore.summaries.stockOverview;

  card.innerHTML = `
    <h3>Current FC Stock</h3>
    <table class="mini-summary-table">
      <tr>
        <td>Total Stock</td>
        <td><strong>${formatNumber(data.totalStock)}</strong></td>
      </tr>
      <tr>
        <td>Total Units Sold</td>
        <td><strong>${formatNumber(data.totalUnitsSold)}</strong></td>
      </tr>
      <tr>
        <td>Overall DRR</td>
        <td><strong>${formatNumber(data.overallDRR)}</strong></td>
      </tr>
      <tr>
        <td>Overall SC</td>
        <td><strong>${formatNumber(data.overallSC)}</strong></td>
      </tr>
    </table>
  `;
}

/* ======================================
   3️⃣ SC BAND SUMMARY
====================================== */

function renderSCBandSummary(card) {

  const data = computedStore.summaries.scBandSummary;

  const bandOrder = [
    "Critical",
    "RISK",
    "Healthy",
    "SAFE",
    "WATCH",
    "Overstock"
  ];

  let rows = "";

  bandOrder.forEach(band => {

    if (data[band]) {

      rows += `
        <tr>
          <td>${band}</td>
          <td>${data[band].skuCount}</td>
          <td>${formatNumber(data[band].totalUnitsSold)}</td>
          <td>${formatNumber(data[band].totalStock)}</td>
        </tr>
      `;
    }
  });

  card.innerHTML = `
    <h3>SC Band Summary</h3>
    <table class="mini-summary-table">
      <thead>
        <tr>
          <th>Band</th>
          <th>SKUs</th>
          <th>Units Sold</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

/* ======================================
   HELPER
====================================== */

function formatNumber(value) {
  if (value === undefined || value === null) return 0;
  return Number(value).toLocaleString("en-IN");
}
