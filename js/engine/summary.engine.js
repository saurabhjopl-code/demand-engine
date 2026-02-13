import { computedStore } from "../store/computed.store.js";
import { dataStore } from "../store/data.store.js";

/* ======================================================
   MASTER SUMMARY BUILDER
====================================================== */

export function buildSummaries() {

  buildMonthWiseSaleSummary();
  buildFCWiseStockSummary();
  buildNumericSCBandSummary();
  buildSizeWiseSummary();
  buildCompanyRemarkSummary(); 
  buildCategorySummary();
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
      monthMap[month] = { month, totalUnits: 0, days: 0 };
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
    grandTotal: { totalUnits: grandUnits, drr: grandDRR }
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
      fcMap[fc] = { fc, totalUnits: 0, totalStock: 0 };
    }

    fcMap[fc].totalUnits += units;
  });

  stockData.forEach(row => {

    const fc = row["FC"];
    const units = Number(row["Units"] || 0);

    if (!fcMap[fc]) {
      fcMap[fc] = { fc, totalUnits: 0, totalStock: 0 };
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
   3️⃣ NUMERIC SC BAND SUMMARY
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

  computedStore.summaries.scBandSummary =
    Object.keys(bucketMap).map(bucket => ({
      band: bucket,
      styleCount: bucketMap[bucket].styles.size,
      totalUnits: bucketMap[bucket].units,
      totalStock: bucketMap[bucket].stock
    }));
}

/* ==========================================
   4️⃣ SIZE-WISE ANALYSIS (FIXED CATEGORY)
========================================== */

function buildSizeWiseSummary() {

  const salesData = dataStore.get("Sales") || [];
  const stockData = dataStore.get("Stock") || [];

  const SIZE_ORDER = [
    "FS","XS","S","M","L","XL","XXL",
    "3XL","4XL","5XL","6XL",
    "7XL","8XL","9XL","10XL"
  ];

  const SIZE_CATEGORY = {
    "FS": "FS",
    "XS": "Normal",
    "S": "Normal",
    "M": "Normal",
    "L": "Normal",
    "XL": "Normal",
    "XXL": "Normal",
    "3XL": "PLUS 1",
    "4XL": "PLUS 1",
    "5XL": "PLUS 1",
    "6XL": "PLUS 1",
    "7XL": "PLUS 2",
    "8XL": "PLUS 2",
    "9XL": "PLUS 2",
    "10XL": "PLUS 2"
  };

  const sizeMap = {};

  SIZE_ORDER.forEach(size => {
    sizeMap[size] = {
      size,
      category: SIZE_CATEGORY[size],
      unitsSold: 0,
      unitsInStock: 0
    };
  });

  salesData.forEach(row => {
    const size = row["Size"];
    const units = Number(row["Units"] || 0);
    if (sizeMap[size]) {
      sizeMap[size].unitsSold += units;
    }
  });

  stockData.forEach(row => {
    const size = row["Size"];
    const units = Number(row["Units"] || 0);
    if (sizeMap[size]) {
      sizeMap[size].unitsInStock += units;
    }
  });

  const grandUnits = Object.values(sizeMap)
    .reduce((sum, r) => sum + r.unitsSold, 0);

  const grandStock = Object.values(sizeMap)
    .reduce((sum, r) => sum + r.unitsInStock, 0);

  const finalRows = SIZE_ORDER.map(size => {
    const row = sizeMap[size];
    return {
      ...row,
      totalUnits: grandUnits,
      totalStock: grandStock,
      sizeShare: grandUnits > 0
        ? Number(((row.unitsSold / grandUnits) * 100).toFixed(2))
        : 0
    };
  });

  computedStore.summaries.sizeWise = finalRows;
}
/* ==========================================
   5️⃣ COMPANY REMARK SUMMARY
========================================== */

function buildCompanyRemarkSummary() {

  const salesData = dataStore.get("Sales") || [];
  const stockData = dataStore.get("Stock") || [];
  const styleStatus = dataStore.get("Style Status") || [];
  const totalDays = computedStore.totalDays || 0;

  const styleRemarkMap = {};

  styleStatus.forEach(row => {
    styleRemarkMap[row["Style ID"]] = row["Company Remark"] || "Unknown";
  });

  const remarkMap = {};

  salesData.forEach(row => {

    const style = row["Style ID"];
    const units = Number(row["Units"] || 0);
    const remark = styleRemarkMap[style] || "Unknown";

    if (!remarkMap[remark]) {
      remarkMap[remark] = {
        remark,
        totalUnits: 0,
        totalStock: 0
      };
    }

    remarkMap[remark].totalUnits += units;
  });

  stockData.forEach(row => {

    const style = row["Style ID"];
    const units = Number(row["Units"] || 0);
    const remark = styleRemarkMap[style] || "Unknown";

    if (!remarkMap[remark]) {
      remarkMap[remark] = {
        remark,
        totalUnits: 0,
        totalStock: 0
      };
    }

    remarkMap[remark].totalStock += units;
  });

  const rows = Object.values(remarkMap);

  rows.forEach(obj => {

    obj.drr = totalDays > 0
      ? Number((obj.totalUnits / totalDays).toFixed(2))
      : 0;

    obj.sc = obj.drr > 0
      ? Math.round(obj.totalStock / obj.drr)
      : 0;
  });

  computedStore.summaries.companyRemark = rows;
}

/* ==========================================
   6️⃣ CATEGORY SUMMARY
========================================== */

function buildCategorySummary() {

  const salesData = dataStore.get("Sales") || [];
  const stockData = dataStore.get("Stock") || [];
  const styleStatus = dataStore.get("Style Status") || [];
  const totalDays = computedStore.totalDays || 0;

  const styleCategoryMap = {};

  styleStatus.forEach(row => {
    styleCategoryMap[row["Style ID"]] = row["Category"] || "Unknown";
  });

  const categoryMap = {};

  salesData.forEach(row => {

    const style = row["Style ID"];
    const units = Number(row["Units"] || 0);
    const category = styleCategoryMap[style] || "Unknown";

    if (!categoryMap[category]) {
      categoryMap[category] = {
        category,
        totalUnits: 0,
        totalStock: 0
      };
    }

    categoryMap[category].totalUnits += units;
  });

  stockData.forEach(row => {

    const style = row["Style ID"];
    const units = Number(row["Units"] || 0);
    const category = styleCategoryMap[style] || "Unknown";

    if (!categoryMap[category]) {
      categoryMap[category] = {
        category,
        totalUnits: 0,
        totalStock: 0
      };
    }

    categoryMap[category].totalStock += units;
  });

  const rows = Object.values(categoryMap);

  rows.forEach(obj => {

    obj.drr = totalDays > 0
      ? Number((obj.totalUnits / totalDays).toFixed(2))
      : 0;

    obj.sc = obj.drr > 0
      ? Math.round(obj.totalStock / obj.drr)
      : 0;
  });

  computedStore.summaries.category = rows;
}
