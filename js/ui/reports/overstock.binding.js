import { computedStore } from "../../store/computed.store.js";

/* ======================================================
   OVERSTOCK REPORT RENDERER
====================================================== */

export function renderOverstockReport() {

  const container = document.getElementById("overstockTable");
  if (!container) return;

  const styles = computedStore.reports?.overstock || [];

  let html = `
    <thead>
      <tr>
        <th>Style / SKU</th>
        <th>Sales</th>
        <th>Stock</th>
        <th>DRR</th>
        <th>SC</th>
        <th>In Production</th>
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
        <td>-</td>
        <td>120+</td>
        <td>-</td>
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
          <td>${format(sku.inProduction)}</td>
        </tr>
      `;
    });

  });

  html += "</tbody>";

  container.innerHTML = html;

  attachExpandEvents();
}

/* ---------- EXPAND ---------- */

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

function format(val) {
  return Number(val || 0).toLocaleString("en-IN");
}
