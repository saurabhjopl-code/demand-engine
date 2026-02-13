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
   DEMAND REPORT (EXPANDABLE BY STYLE)
========================================== */

function renderDemandReport() {

  const container = document.getElementById("demandTable");
  if (!container) return;

  const styles = computedStore.reports?.demand || [];

  let html = `
    <thead>
      <tr>
        <th>Style / SKU</th>
        <th>Sales</th>
        <th>Stock</th>
        <th>DRR</th>
        <th>SC</th>
        <th>Req 45D</th>
        <th>Req 60D</th>
        <th>Req 90D</th>
        <th>Direct 90D</th>
        <th>In Production</th>
        <th>Pend 90D</th>
        <th>Buy Bucket</th>
      </tr>
    </thead>
    <tbody>
  `;

  styles.forEach((style, index) => {

    html += `
      <tr class="style-row" data-style="${index}">
        <td class="expand-toggle">▶ ${style.styleID}</td>
        <td>${format(style.totals.sales)}</td>
        <td>${format(style.totals.stock)}</td>
        <td>${format(style.totals.drr)}</td>
        <td>${format(style.totals.sc)}</td>
        <td>${format(style.totals.required45)}</td>
        <td>${format(style.totals.required60)}</td>
        <td>${format(style.totals.required90)}</td>
        <td>${format(style.totals.direct90)}</td>
        <td>${format(style.totals.inProduction)}</td>
        <td>${format(style.totals.pend90)}</td>
        <td>${style.buyBucket}</td>
      </tr>
    `;

    style.skus.forEach(sku => {

      html += `
        <tr class="sku-row style-${index}" style="display:none;">
          <td class="sku-indent">• ${sku.sku}</td>
          <td>${format(sku.sales)}</td>
          <td>${format(sku.stock)}</td>
          <td>${format(sku.drr)}</td>
          <td>${format(sku.sc)}</td>
          <td>${format(sku.required45)}</td>
          <td>${format(sku.required60)}</td>
          <td>${format(sku.required90)}</td>
          <td>${format(sku.direct90)}</td>
          <td>${format(sku.inProduction)}</td>
          <td>${format(sku.pend90)}</td>
          <td>${sku.buyBucket}</td>
        </tr>
      `;
    });

  });

  html += `</tbody>`;

  container.innerHTML = html;

  attachExpandEvents();
}

/* ==========================================
   EXPAND / COLLAPSE LOGIC
========================================== */

function attachExpandEvents() {

  const toggles = document.querySelectorAll(".style-row");

  toggles.forEach(row => {

    row.addEventListener("click", () => {

      const index = row.dataset.style;
      const skuRows = document.querySelectorAll(`.style-${index}`);
      const toggleCell = row.querySelector(".expand-toggle");

      const isOpen = skuRows[0]?.style.display === "table-row";

      skuRows.forEach(r => {
        r.style.display = isOpen ? "none" : "table-row";
      });

      toggleCell.textContent = isOpen
        ? toggleCell.textContent.replace("▼","▶")
        : toggleCell.textContent.replace("▶","▼");
    });

  });
}

/* ==========================================
   BUY BUCKET SUMMARY (EXPANDABLE)
========================================== */

function renderBuyBucketSummary() {

  const table = document.getElementById("buyBucketTable");
  if (!table) return;

  const buckets = computedStore.reports?.buyBucketSummary || {};

  let html = `
    <thead>
      <tr>
        <th>Buy Bucket</th>
        <th>Total Pendancy (90D)</th>
      </tr>
    </thead>
    <tbody>
  `;

  Object.keys(buckets).forEach((bucket, index) => {

    const data = buckets[bucket];

    html += `
      <tr class="bucket-row" data-bucket="${index}">
        <td class="expand-toggle">▶ ${bucket}</td>
        <td>${format(data.totalPendancy)}</td>
      </tr>
    `;

    data.styles.forEach(style => {

      html += `
        <tr class="bucket-style bucket-${index}" style="display:none;">
          <td class="sku-indent">${style.styleID}</td>
          <td>${format(style.totals.pend90)}</td>
        </tr>
      `;
    });
  });

  html += `</tbody>`;

  table.innerHTML = html;

  attachBucketEvents();
}

function attachBucketEvents() {

  const rows = document.querySelectorAll(".bucket-row");

  rows.forEach(row => {

    row.addEventListener("click", () => {

      const index = row.dataset.bucket;
      const styles = document.querySelectorAll(`.bucket-${index}`);
      const toggleCell = row.querySelector(".expand-toggle");

      const isOpen = styles[0]?.style.display === "table-row";

      styles.forEach(r => {
        r.style.display = isOpen ? "none" : "table-row";
      });

      toggleCell.textContent = isOpen
        ? toggleCell.textContent.replace("▼","▶")
        : toggleCell.textContent.replace("▶","▼");
    });

  });
}
