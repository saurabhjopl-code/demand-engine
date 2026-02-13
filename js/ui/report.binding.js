import { computedStore } from "../store/computed.store.js";

/* ======================================================
   MASTER REPORT RENDERER
====================================================== */

export function renderReports() {

  renderDemandReport();
  renderBuyBucketSummary();
}

/* ==========================================
   FORMATTER
========================================== */

function format(val) {
  return Number(val || 0).toLocaleString("en-IN");
}

/* ==========================================
   DEMAND REPORT TABLE
========================================== */

function renderDemandReport() {

  const table = document.getElementById("demandTable");
  if (!table) return;

  const rows = computedStore.reports?.demand || [];

  let bodyHTML = "";

  rows.forEach(row => {

    bodyHTML += `
      <tr>
        <td>${row.sku}</td>
        <td>${format(row.sales)}</td>
        <td>${format(row.stock)}</td>
        <td>${format(row.drr)}</td>
        <td>${format(row.sc)}</td>

        <td>${format(row.required45)}</td>
        <td>${format(row.required60)}</td>
        <td>${format(row.required90)}</td>

        <td>${format(row.direct45)}</td>
        <td>${format(row.direct60)}</td>
        <td>${format(row.direct90)}</td>

        <td>${format(row.inProduction)}</td>

        <td>${format(row.pend45)}</td>
        <td>${format(row.pend60)}</td>
        <td>${format(row.pend90)}</td>

        <td>${row.buyBucket}</td>
      </tr>
    `;
  });

  table.innerHTML = `
    <thead>
      <tr>
        <th rowspan="2">SKU</th>
        <th rowspan="2">Sales</th>
        <th rowspan="2">Stock</th>
        <th rowspan="2">DRR</th>
        <th rowspan="2">SC</th>

        <th colspan="3">Required</th>
        <th colspan="3">Direct Demand</th>
        <th rowspan="2">In Production</th>
        <th colspan="3">Pendancy</th>

        <th rowspan="2">Buy Bucket</th>
      </tr>
      <tr>
        <th>45D</th>
        <th>60D</th>
        <th>90D</th>

        <th>45D</th>
        <th>60D</th>
        <th>90D</th>

        <th>45D</th>
        <th>60D</th>
        <th>90D</th>
      </tr>
    </thead>
    <tbody>
      ${bodyHTML}
    </tbody>
  `;
}

/* ==========================================
   BUY BUCKET SUMMARY
========================================== */

function renderBuyBucketSummary() {

  const table = document.getElementById("buyBucketTable");
  if (!table) return;

  const rows = computedStore.reports?.buyBucketSummary || [];

  let bodyHTML = "";

  rows.forEach(row => {

    bodyHTML += `
      <tr>
        <td>${row.bucket}</td>
        <td>${format(row.totalPendancy)}</td>
      </tr>
    `;
  });

  table.innerHTML = `
    <thead>
      <tr>
        <th>Buy Bucket</th>
        <th>Total Pendancy (90D)</th>
      </tr>
    </thead>
    <tbody>
      ${bodyHTML}
    </tbody>
  `;
}
