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
   DEMAND REPORT (STYLE → SKU EXPANDABLE)
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

    const totals = style.totals || {};

    html += `
      <tr class="style-row" data-style="${index}">
        <td class="expand-toggle">▶ ${style.styleID || "-"}</td>
        <td>${format(totals.sales)}</td>
        <td>${format(totals.stock)}</td>
        <td>${format(totals.drr)}</td>
        <td>${format(totals.sc)}</td>
        <td>${format(totals.required45)}</td>
        <td>${format(totals.required60)}</td>
        <td>${format(totals.required90)}</td>
        <td>${format(totals.direct90)}</td>
        <td>${format(totals.inProduction)}</td>
        <td>${format(totals.pend90)}</td>
        <td>${style.buyBucket || "-"}</td>
      </tr>
    `;

    (style.skus || []).forEach(sku => {

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
   STYLE EXPAND / COLLAPSE
========================================== */

function attachExpandEvents() {

  const styleRows = document.querySelectorAll(".style-row");

  styleRows.forEach(row => {

    row.onclick = null;

    row.addEventListener("click", () => {

      const index = row.dataset.style;
      const skuRows = document.querySelectorAll(`.style-${index}`);
      if (!skuRows.length) return;

      const toggleCell = row.querySelector(".expand-toggle");
      const isOpen = skuRows[0].style.display === "table-row";

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

    const data = buckets[bucket] || { totalPendancy: 0, styles: [] };

    html += `
      <tr class="bucket-row" data-bucket="${index}">
        <td class="expand-toggle">▶ ${bucket}</td>
        <td>${format(data.totalPendancy)}</td>
      </tr>
    `;

    (data.styles || []).forEach(style => {

      html += `
        <tr class="bucket-style bucket-${index}" style="display:none;">
          <td class="sku-indent">${style.styleID}</td>
          <td>${format(style.totals?.pend90)}</td>
        </tr>
      `;
    });
  });

  html += `</tbody>`;

  table.innerHTML = html;

  attachBucketEvents();
}

/* ==========================================
   BUCKET EXPAND / COLLAPSE
========================================== */

function attachBucketEvents() {

  const bucketRows = document.querySelectorAll(".bucket-row");

  bucketRows.forEach(row => {

    row.onclick = null;

    row.addEventListener("click", () => {

      const index = row.dataset.bucket;
      const styles = document.querySelectorAll(`.bucket-${index}`);
      if (!styles.length) return;

      const toggleCell = row.querySelector(".expand-toggle");
      const isOpen = styles[0].style.display === "table-row";

      styles.forEach(r => {
        r.style.display = isOpen ? "none" : "table-row";
      });

      toggleCell.textContent = isOpen
        ? toggleCell.textContent.replace("▼","▶")
        : toggleCell.textContent.replace("▶","▼");
    });

  });
}
