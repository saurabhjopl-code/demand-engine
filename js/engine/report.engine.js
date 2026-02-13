import { dataStore } from "../store/data.store.js";
import { computedStore } from "../store/computed.store.js";

/* ======================================================
   MASTER REPORT BUILDER
====================================================== */

export function buildReports() {

  buildDemandReport();
  buildBuyBucketSummary();
  buildSizeCurveReport();
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
      ? Math.round(obj.totalStock / drr)
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
   BUY BUCKET SUMMARY
========================================== */

function buildBuyBucketSummary() {

  const demandRows = computedStore.reports?.demand || [];
  const bucketMap = {};

  demandRows.forEach(row => {

    if (!bucketMap[row.buyBucket]) {
      bucketMap[row.buyBucket] = 0;
    }

    bucketMap[row.buyBucket] += row.pend90;
  });

  computedStore.reports.buyBucketSummary =
    Object.keys(bucketMap).map(bucket => ({
      bucket,
      totalPendancy: bucketMap[bucket]
    }));
}

/* ==========================================
   SIZE CURVE REPORT (STYLE LEVEL)
========================================== */

function buildSizeCurveReport() {

  const salesData = dataStore.get("Sales") || [];
  const stockData = dataStore.get("Stock") || [];

  const totalDays = computedStore.totalDays || 0;

  const SIZE_ORDER = [
    "FS","XS","S","M","L","XL","XXL",
    "3XL","4XL","5XL","6XL",
    "7XL","8XL","9XL","10XL"
  ];

  const styleMap = {};

  /* ---------- SALES ---------- */

  salesData.forEach(row => {

    const style = row["Style ID"];
    const size = row["Size"];
    const units = Number(row["Units"] || 0);

    if (!styleMap[style]) {
      styleMap[style] = {
        style,
        totalSales: 0,
        sizeSales: {},
        sizeStock: {}
      };
    }

    styleMap[style].totalSales += units;

    if (!styleMap[style].sizeSales[size]) {
      styleMap[style].sizeSales[size] = 0;
    }

    styleMap[style].sizeSales[size] += units;
  });

  /* ---------- STOCK ---------- */

  stockData.forEach(row => {

    const style = row["Style ID"];
    const size = row["Size"];
    const units = Number(row["Units"] || 0);

    if (!styleMap[style]) return;

    if (!styleMap[style].sizeStock[size]) {
      styleMap[style].sizeStock[size] = 0;
    }

    styleMap[style].sizeStock[size] += units;
  });

  const rows = [];

  Object.values(styleMap).forEach(obj => {

    const styleDRR = totalDays > 0
      ? obj.totalSales / totalDays
      : 0;

    const styleDemand45 = Math.round(styleDRR * 45);

    const sizeRow = {
      style: obj.style,
      styleDemand: styleDemand45
    };

    SIZE_ORDER.forEach(size => {

      const sizeSales = obj.sizeSales[size] || 0;
      const sizeStock = obj.sizeStock[size] || 0;

      const sizeShare =
        obj.totalSales > 0
          ? sizeSales / obj.totalSales
          : 0;

      const rawRequired =
        Math.round(styleDemand45 * sizeShare);

      const recommended =
        Math.max(0, rawRequired - sizeStock);

      sizeRow[size] = recommended || "";
    });

    rows.push(sizeRow);
  });

  rows.sort((a,b) => b.styleDemand - a.styleDemand);

  computedStore.reports.sizeCurve = rows;
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
