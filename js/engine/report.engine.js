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
   DEMAND REPORT (90D DEFAULT)
========================================== */

function buildDemandReport() {

  const salesData = dataStore.get("Sales") || [];
  const stockData = dataStore.get("Stock") || [];
  const productionData = dataStore.get("Production") || [];

  const totalDays = computedStore.totalDays || 0;
  const DEMAND_DAYS = 90;

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

    const requiredStock = drr * DEMAND_DAYS;

    let directDemand = Math.round(requiredStock - obj.totalStock);
    if (directDemand < 0) directDemand = 0;

    let pendancy = directDemand - obj.inProduction;
    if (pendancy < 0) pendancy = 0;

    const buyBucket = getSCBucket(sc);

    rows.push({
      sku: obj.sku,
      sales: obj.totalUnits,
      stock: obj.totalStock,
      drr,
      sc,
      requiredStock: Math.round(requiredStock),
      directDemand,
      inProduction: obj.inProduction,
      pendancy,
      buyBucket
    });
  });

  rows.sort((a,b) => b.sales - a.sales);

  computedStore.reports = computedStore.reports || {};
  computedStore.reports.demand = rows;
}

/* ==========================================
   BUY BUCKET SUMMARY
========================================== */

function buildBuyBucketSummary() {

  const demandRows = computedStore.reports?.demand || [];

  const bucketMap = {};

  demandRows.forEach(row => {

    if (!bucketMap[row.buyBucket]) {
      bucketMap[row.buyBucket] = 0;
    }

    bucketMap[row.buyBucket] += row.pendancy;
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
