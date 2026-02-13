import { dataStore } from "../store/data.store.js";
import { computedStore } from "../store/computed.store.js";

/* ======================================================
   MASTER REPORT BUILDER
====================================================== */

export function buildReports() {

  buildDemandReport();
  buildBuyBucketSummary();
}

/* ==========================================
   DEMAND REPORT (GROUPED BY STYLE ID)
   BASED ON CURRENT V1.6 LOGIC
========================================== */

function buildDemandReport() {

  const salesData = dataStore.get("Sales") || [];
  const stockData = dataStore.get("Stock") || [];
  const productionData = dataStore.get("Production") || [];

  const totalDays = computedStore.totalDays || 0;

  const skuMap = {};
  const skuStyleMap = {};

  /* ---------- SALES ---------- */

  salesData.forEach(row => {

    const sku = row["Uniware SKU"];
    const styleID = row["Style ID"];
    const units = Number(row["Units"] || 0);

    if (!skuMap[sku]) {
      skuMap[sku] = {
        sku,
        styleID,
        totalUnits: 0,
        totalStock: 0,
        inProduction: 0
      };
    }

    skuMap[sku].totalUnits += units;
  });

  /* ---------- STOCK ---------- */

  stockData.forEach(row => {

    const sku = row["Uniware SKU"];
    const units = Number(row["Units"] || 0);

    if (!skuMap[sku]) {
      skuMap[sku] = {
        sku,
        styleID: null,
        totalUnits: 0,
        totalStock: 0,
        inProduction: 0
      };
    }

    skuMap[sku].totalStock += units;
  });

  /* ---------- PRODUCTION ---------- */

  productionData.forEach(row => {

    const sku = row["Uniware SKU"];
    const units = Number(row["In Production"] || 0);

    if (!skuMap[sku]) {
      skuMap[sku] = {
        sku,
        styleID: null,
        totalUnits: 0,
        totalStock: 0,
        inProduction: 0
      };
    }

    skuMap[sku].inProduction += units;
  });

  /* ==========================================
     BUILD SKU LEVEL CALCULATIONS
  ========================================== */

  const skuRows = [];

  Object.values(skuMap).forEach(obj => {

    const drr = totalDays > 0
      ? Number((obj.totalUnits / totalDays).toFixed(2))
      : 0;

    const sc = drr > 0
      ? Number((obj.totalStock / drr).toFixed(0))
      : 0;

    const req45 = Math.round(drr * 45);
    const req60 = Math.round(drr * 60);
    const req90 = Math.round(drr * 90);

    const direct45 = Math.max(0, req45 - obj.totalStock);
    const direct60 = Math.max(0, req60 - obj.totalStock);
    const direct90 = Math.max(0, req90 - obj.totalStock);

    const pend45 = Math.max(0, direct45 - obj.inProduction);
    const pend60 = Math.max(0, direct60 - obj.inProduction);
    const pend90 = Math.max(0, direct90 - obj.inProduction);

    const buyBucket = getSCBucket(sc);

    skuRows.push({
      sku: obj.sku,
      styleID: obj.styleID || "Unknown",
      sales: obj.totalUnits,
      stock: obj.totalStock,
      drr,
      sc,
      required45: req45,
      required60: req60,
      required90: req90,
      direct45,
      direct60,
      direct90,
      inProduction: obj.inProduction,
      pend45,
      pend60,
      pend90,
      buyBucket
    });
  });

  /* ==========================================
     GROUP BY STYLE ID
  ========================================== */

  const styleMap = {};

  skuRows.forEach(row => {

    const styleID = row.styleID || "Unknown";

    if (!styleMap[styleID]) {
      styleMap[styleID] = {
        styleID,
        totals: {
          sales: 0,
          stock: 0,
          required45: 0,
          required60: 0,
          required90: 0,
          direct45: 0,
          direct60: 0,
          direct90: 0,
          inProduction: 0,
          pend45: 0,
          pend60: 0,
          pend90: 0
        },
        skus: []
      };
    }

    const t = styleMap[styleID].totals;

    t.sales += row.sales;
    t.stock += row.stock;
    t.required45 += row.required45;
    t.required60 += row.required60;
    t.required90 += row.required90;
    t.direct45 += row.direct45;
    t.direct60 += row.direct60;
    t.direct90 += row.direct90;
    t.inProduction += row.inProduction;
    t.pend45 += row.pend45;
    t.pend60 += row.pend60;
    t.pend90 += row.pend90;

    styleMap[styleID].skus.push(row);
  });

  const finalRows = Object.values(styleMap);

  /* Calculate DRR & SC at STYLE LEVEL */

  finalRows.forEach(style => {

    style.totals.drr = totalDays > 0
      ? Number((style.totals.sales / totalDays).toFixed(2))
      : 0;

    style.totals.sc = style.totals.drr > 0
      ? Math.round(style.totals.stock / style.totals.drr)
      : 0;

    style.buyBucket = getSCBucket(style.totals.sc);
  });

  finalRows.sort((a,b) => b.totals.sales - a.totals.sales);

  computedStore.reports = computedStore.reports || {};
  computedStore.reports.demand = finalRows;
}

/* ==========================================
   BUY BUCKET SUMMARY (90D PENDANCY)
========================================== */

function buildBuyBucketSummary() {

  const styles = computedStore.reports?.demand || [];

  const bucketMap = {};

  styles.forEach(style => {

    const bucket = style.buyBucket;

    if (!bucketMap[bucket]) {
      bucketMap[bucket] = {
        totalPendancy: 0,
        styles: []
      };
    }

    bucketMap[bucket].totalPendancy += style.totals.pend90;
    bucketMap[bucket].styles.push(style);
  });

  computedStore.reports.buyBucketSummary = bucketMap;
}

/* ==========================================
   SC BUCKET LOGIC
========================================== */

function getSCBucket(sc) {

  if (sc < 30) return "Critical";
  if (sc < 45) return "Risk";
  if (sc < 60) return "Healthy";
  if (sc < 90) return "Safe";
  if (sc < 120) return "Watch";
  return "Overstock";
}
