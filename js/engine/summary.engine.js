import { computedStore } from "../store/computed.store.js";
import { dataStore } from "../store/data.store.js";

/* ======================================================
   MASTER SUMMARY BUILDER
====================================================== */

export function buildSummaries() {

  buildMonthWiseSaleSummary();
  buildFCWiseStockSummary();
  buildNumericSCBandSummary();
  buildSizeWiseSummary(); // 🔥 NEW
}

/* ==========================================
   1️⃣ MONTH-WISE SALE SUMMARY
========================================== */

function buildMonthWiseSaleSummary() {

  const salesData = dataStore.get("Sales") || [];
  const saleDaysData = dataStore.get("Sale Days") || [];

  const monthMap = {};
  let grandUnits = 0;
  let grandDays = 0;

  salesData.forEach(row => {

    const month = row["Month"];
    const units = Number(row["Units"] || 0);

    if (!monthMap[month]) {
      monthMap[month] = {
        month,
        totalUnits: 0,
        days: 0
      };
    }

    monthMap[month].totalUnits += units;
  });

  saleDaysData.forEach(row => {

    const month = row["Month"];
    const days = Number(row["Days"] || 0);

    if (monthMap[month]) {
      monthMap[month].days = days;
    }
  });

  Object.values(monthMap).forEach(obj => {

    obj.drr = obj.days > 0
      ? Number((obj.totalUnits / obj.days).toFixed(2))
      : 0;

    grandUnits += obj.totalUnits;
    grandDays += obj.days;
  });

  const grandDRR = grandDays > 0
    ? Number((grandUnits / grandDays).toFixed(2))
    : 0;

  computedStore.summaries.saleDetails = {
    rows: Object.values(monthMap),
    grandTotal: {
      totalUnits: grandUnits,
      drr: grandDRR
    }
  };
}

/* ==========================================
   2️⃣ FC-WISE STOCK SUMMARY
========================================== */

function buildFCWiseStockSummary() {

  const salesData = dataStore.get("Sales") || [];
  const stockData = dataStore.get("Stock") || [];
  const totalDays = computedStore.totalDays || 0;

  const fcMap = {};

  salesData.forEach(row => {

    const fc = row["FC"];
    const units = Number(row["Units"] || 0);

    if (!fcMap[fc]) {
      fcMap[fc] = {
        fc,
        totalUnits: 0,
        totalStock: 0
      };
    }

    fcMap[fc].totalUnits += units;
  });

  stockData.forEach(row => {

    const fc = row["FC"];
    const units = Number(row["Units"] || 0);

    if (!fcMap[fc]) {
      fcMap[fc] = {
        fc,
        totalUnits: 0,
        totalStock: 0
      };
    }

    fcMap[fc].totalStock += units;
  });

  let grandUnits = 0;
  let grandStock = 0;

  Object.values(fcMap).forEach(obj => {

    obj.drr = totalDays > 0
      ? Number((obj.totalUnits / totalDays).toFixed(2))
      : 0;

    obj.sc = obj.drr > 0
      ? Math.round(obj.totalStock / obj.drr)
      : 0;

    grandUnits += obj.totalUnits;
    grandStock += obj.totalStock;
  });

  const grandDRR = totalDays > 0
    ? Number((grandUnits / totalDays).toFixed(2))
    : 0;

  const grandSC = grandDRR > 0
    ? Math.round(grandStock / grandDRR)
    : 0;

  computedStore.summaries.stockOverview = {
    rows: Object.values(fcMap),
    grandTotal: {
      totalUnits: grandUnits,
      totalStock: grandStock,
      drr: grandDRR,
      sc: grandSC
    }
  };
}

/* ==========================================
   3️⃣ NUMERIC SC BAND SUMMARY (BY STYLE)
========================================== */

function buildNumericSCBandSummary() {

  const bucketMap = {
    "0–30": { styles: new Set(), units: 0, stock: 0 },
    "30–60": { styles: new Set(), units: 0, stock: 0 },
    "60–120": { styles: new Set(), units: 0, stock: 0 },
    "120+": { styles: new Set(), units: 0, stock: 0 }
  };

  for (const sku in computedStore.skuSC || {}) {

    const sc = computedStore.skuSC[sku]?.sc || 0;
    const style = computedStore.skuSales[sku]?.styleID;
    const units = computedStore.skuSales[sku]?.totalUnits || 0;
    const stock = computedStore.skuStock[sku]?.totalStock || 0;

    let bucket = "0–30";

    if (sc >= 120) bucket = "120+";
    else if (sc >= 60) bucket = "60–120";
    else if (sc >= 30) bucket = "30–60";

    if (style) bucketMap[bucket].styles.add(style);

    bucketMap[bucket].units += units;
    bucketMap[bucket].stock += stock;
  }

  const rows = Object.keys(bucketMap).map(bucket => ({
    band: bucket,
    styleCount: bucketMap[bucket].styles.size,
    totalUnits: bucketMap[bucket].units,
    totalStock: bucketMap[bucket].stock
  }));

  computedStore.summaries.scBandSummary = rows;
}

/* ==========================================
   4️⃣ SIZE-WISE ANALYSIS
========================================== */

function buildSizeWiseSummary() {

  const salesData = dataStore.get("Sales") || [];
  const stockData = dataStore.get("Stock") || [];
  const styleStatus = dataStore.get("Style Status") || [];

  const styleCategoryMap = {};

  styleStatus.forEach(row => {
    styleCategoryMap[row["Style ID"]] = row["Category"] || "Unknown";
  });

  const categoryMap = {};

  salesData.forEach(row => {

    const style = row["Style ID"];
    const size = row["Size"];
    const units = Number(row["Units"] || 0);
    const category = styleCategoryMap[style] || "Unknown";

    if (!categoryMap[category]) {
      categoryMap[category] = {
        totalUnits: 0,
        totalStock: 0,
        sizes: {}
      };
    }

    if (!categoryMap[category].sizes[size]) {
      categoryMap[category].sizes[size] = {
        unitsSold: 0,
        stock: 0
      };
    }

    categoryMap[category].sizes[size].unitsSold += units;
    categoryMap[category].totalUnits += units;
  });

  stockData.forEach(row => {

    const style = row["Style ID"];
    const size = row["Size"];
    const units = Number(row["Units"] || 0);
    const category = styleCategoryMap[style] || "Unknown";

    if (!categoryMap[category]) return;

    if (!categoryMap[category].sizes[size]) {
      categoryMap[category].sizes[size] = {
        unitsSold: 0,
        stock: 0
      };
    }

    categoryMap[category].sizes[size].stock += units;
    categoryMap[category].totalStock += units;
  });

  const finalRows = [];

  Object.keys(categoryMap).forEach(category => {

    const catObj = categoryMap[category];

    Object.keys(catObj.sizes).forEach(size => {

      const sizeObj = catObj.sizes[size];

      const sizeShare = catObj.totalUnits > 0
        ? (sizeObj.unitsSold / catObj.totalUnits) * 100
        : 0;

      finalRows.push({
        size,
        category,
        unitsSold: sizeObj.unitsSold,
        totalUnits: catObj.totalUnits,
        sizeShare: Number(sizeShare.toFixed(2)),
        unitsInStock: sizeObj.stock,
        totalStock: catObj.totalStock
      });
    });
  });

  computedStore.summaries.sizeWise = finalRows;
}
