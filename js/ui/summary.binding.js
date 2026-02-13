import { computedStore } from "../store/computed.store.js";

export function renderSummaries() {

  const cards = document.querySelectorAll(".summary-card");
  if (!cards || cards.length < 3) return;

  renderMonthWiseSale(cards[0]);
  renderFCWiseStock(cards[1]);
  renderSCBand(cards[2]);
}

/* ======================================
   1️⃣ MONTH-WISE SALE
====================================== */

function renderMonthWiseSale(card) {

  const data = computedStore.summaries.saleDetails;

  let rows = "";

  Object.values(data).forEach(obj => {

    rows += `
      <tr>
        <td>${obj.month}</td>
        <td>${format(obj.totalUnits)}</td>
        <td>${obj.drr}</td>
      </tr>
    `;
  });

  card.innerHTML = `
    <h3>Sale Details</h3>
    <table class="mini-summary-table">
      <thead>
        <tr>
          <th>Month</th>
          <th>Total Units</th>
          <th>DRR</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

/* ======================================
   2️⃣ FC-WISE STOCK
====================================== */

function renderFCWiseStock(card) {

  const data = computedStore.summaries.stockOverview;

  let rows = "";

  Object.values(data).forEach(obj => {

    rows += `
      <tr>
        <td>${obj.fc}</td>
        <td>${format(obj.totalStock)}</td>
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
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

/* ======================================
   3️⃣ SC BAND SUMMARY
====================================== */

function renderSCBand(card) {

  const data = computedStore.summaries.scBandSummary;

  let rows = "";

  Object.values(data).forEach(obj => {

    rows += `
      <tr>
        <td>${obj.band}</td>
        <td>${obj.range}</td>
        <td>${obj.skuCount}</td>
      </tr>
    `;
  });

  card.innerHTML = `
    <h3>SC Band Summary</h3>
    <table class="mini-summary-table">
      <thead>
        <tr>
          <th>Band</th>
          <th>Range</th>
          <th># of SKUs</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function format(value) {
  return Number(value || 0).toLocaleString("en-IN");
}
