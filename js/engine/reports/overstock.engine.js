import { dataStore } from "../../store/data.store.js";
import { computedStore } from "../../store/computed.store.js";

/* ======================================================
   OVERSTOCK REPORT ENGINE
====================================================== */

export function buildOverstockReport() {

  const salesData = dataStore.get("Sales") || [];
  const stockData = dataStore.get("Stock") || [];
  const productionData = dataStore.get("Production") || [];

  const totalDays = computedStore.totalDays || 0;

  const styleMap = {};

  /* ---------- SALES ---------- */

  salesData.forEach(row => {

    const styleID = row["Style ID"];
    const sku = row["Uniware SKU"];
    const units = Number(row["Units"] || 0);

    if (!styleMap[styleID]) {
      styleMap[styleID] = initStyle(styleID);
    }

    if (!styleMap[styleID].skuMap[sku]) {
      styleMap[styleID].skuMap[sku] = initSKU(sku);
    }

    styleMap[styleID].skuMap[sku].sales += units;
  });

  /* ---------- STOCK ---------- */

  stockData.forEach(row => {

    const styleID = row["Style ID"];
    const sku = row["Uniware SKU"];
    const units = Number(row["Units"] || 0);

    if (!styleMap[styleID]) {
      styleMap[styleID] = initStyle(styleID);
    }

    if (!styleMap[styleID].skuMap[sku]) {
      styleMap[styleID].skuMap[sku] = initSKU(sku);
    }

    styleMap[styleID].skuMap[sku].stock += units;
  });

  /* ---------- PRODUCTION ---------- */

  productionData.forEach(row => {

    const styleID = row["Style ID"];
    const sku = row["Uniware SKU"];
    const units = Number(row["In Production"] || 0);

    if (!styleMap[styleID]) {
      styleMap[styleID] = initStyle(styleID);
    }

    if (!styleMap[styleID].skuMap[sku]) {
      styleMap[styleID].skuMap[sku] = initSKU(sku);
    }

    styleMap[styleID].skuMap[sku].inProduction += units;
  });

  /* ---------- CALCULATIONS ---------- */

  const overstockStyles = [];

  Object.values(styleMap).forEach(style => {

    let totalSales = 0;
    let totalStock = 0;

    const skuRows = [];

    Object.values(style.skuMap).forEach(sku => {

      const drr = totalDays > 0
        ? Number((sku.sales / totalDays).toFixed(2))
        : 0;

      const sc = drr > 0
        ? Number((sku.stock / drr).toFixed(0))
        : 0;

      if (sc >= 120) {

        skuRows.push({
          sku: sku.sku,
          sales: sku.sales,
          stock: sku.stock,
          drr,
          sc,
          inProduction: sku.inProduction
        });

        totalSales += sku.sales;
        totalStock += sku.stock;
      }

    });

    if (skuRows.length > 0) {

      overstockStyles.push({
        styleID: style.styleID,
        totals: {
          sales: totalSales,
          stock: totalStock
        },
        skus: skuRows.sort((a,b) => b.sales - a.sales)
      });

    }

  });

  overstockStyles.sort((a,b) => b.totals.sales - a.totals.sales);

  computedStore.reports = computedStore.reports || {};
  computedStore.reports.overstock = overstockStyles;
}

/* ---------- HELPERS ---------- */

function initStyle(styleID) {
  return {
    styleID,
    skuMap: {}
  };
}

function initSKU(sku) {
  return {
    sku,
    sales: 0,
    stock: 0,
    inProduction: 0
  };
}
