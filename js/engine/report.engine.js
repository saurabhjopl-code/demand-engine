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
   DEMAND REPORT (45D / 60D / 90D)
========================================== */

function buildDemandReport() {

  const salesData = dataStore.get("Sales") || [];
  const stockData = dataStore.get("Stock") || [];
  const productionData = dataStore.get("Production") || [];

  const totalDays = computedStore.totalDays || 0;

  const skuMap = {};

  /* ---------- SALES ---------- */

  salesData.forEach(row => {

    const sku = row["Uniware SKU"];
    const units = Number(row["Units"] || 0);

    if (!skuMap[sku]) {
      skuMap[sku] = {
        sku,
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
        totalUnits: 0,
        totalStock: 0,
        inProduction: 0
      };
    }

    skuMap[sku].inProduction += units;
  });

  const rows = [];

  Object.values(skuMap).forEach(obj => {

    const drr = totalDays > 0
      ? Number((obj.totalUnits / totalDays).toFixed(2))
      : 0;

    const sc = drr > 0
      ? Number((obj.totalStock / drr).toFixed(0))
      : 0;

    /* ---------- REQUIRED STOCK ---------- */

    const req45 = Math.round(drr * 45);
    const req60 = Math.round(drr * 60);
    const req90 = Math.round(drr * 90);

    /* ---------- DIRECT DEMAND ---------- */

    const direct45 = Math.max(0, req45 - obj.totalStock);
    const direct60 = Math.max(0, req60 - obj.totalStock);
    const direct90 = Math.max(0, req90 - obj.totalStock);

    /* ---------- PENDANCY ---------- */

    const pend45 = Math.max(0, direct45 - obj.inProduction);
    const pend60 = Math.max(0, direct60 - obj.inProduction);
    const pend90 = Math.max(0, direct90 - obj.inProduction);

    const buyBucket = getSCBucket(sc);

    rows.push({
      sku: obj.sku,
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

  rows.sort((a,b) => b.sales - a.sales);

  computedStore.reports = computedStore.reports || {};
  computedStore.reports.demand = rows;
}

/* ==========================================
   BUY BUCKET SUMMARY (BASED ON 90D PENDANCY)
========================================== */

function buildBuyBucketSummary() {

  const demandRows = computedStore.reports?.demand || [];

  const bucketMap = {};

  demandRows.forEach(row => {

    if (!bucketMap[row.buyBucket]) {
      bucketMap[row.buyBucket] = 0;
    }

    bucketMap[row.buyBucket] += row.pend90; // using 90D as primary
  });

  const summary = Object.keys(bucketMap).map(bucket => ({
    bucket,
    totalPendancy: bucketMap[bucket]
  }));

  computedStore.reports.buyBucketSummary = summary;
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
