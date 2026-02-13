import { computedStore } from "../store/computed.store.js";
import { dataStore } from "../store/data.store.js";

export function buildSummaries() {

  buildMonthWiseSaleSummary();
  buildFCWiseStockSummary();
  buildSCBandSummary();
}

/* ======================================
   1️⃣ MONTH-WISE SALE DETAILS
====================================== */

function buildMonthWiseSaleSummary() {

  const salesData = dataStore.get("Sales");
  const saleDaysData = dataStore.get("Sale Days");

  const monthMap = {};

  salesData.forEach(row => {

    const month = row["Month"];
    const units = Number(row["Units"] || 0);

    if (!monthMap[month]) {
      monthMap[month] = {
        month: month,
        totalUnits: 0,
        days: 0
      };
    }

    monthMap[month].totalUnits += units;
  });

  // Map days
  saleDaysData.forEach(row => {
    const month = row["Month"];
    const days = Number(row["Days"] || 0);

    if (monthMap[month]) {
      monthMap[month].days = days;
    }
  });

  // Calculate DRR per month
  Object.keys(monthMap).forEach(month => {
    const obj = monthMap[month];
    obj.drr = obj.days > 0
      ? Number((obj.totalUnits / obj.days).toFixed(2))
      : 0;
  });

  computedStore.summaries.saleDetails = monthMap;
}

/* ======================================
   2️⃣ FC-WISE STOCK SUMMARY
====================================== */

function buildFCWiseStockSummary() {

  const stockData = dataStore.get("Stock");

  const fcMap = {};

  stockData.forEach(row => {

    const fc = row["FC"];
    const units = Number(row["Units"] || 0);

    if (!fcMap[fc]) {
      fcMap[fc] = {
        fc: fc,
        totalStock: 0
      };
    }

    fcMap[fc].totalStock += units;
  });

  computedStore.summaries.stockOverview = fcMap;
}

/* ======================================
   3️⃣ SC BAND SUMMARY (WITH RANGE)
====================================== */

function buildSCBandSummary() {

  const bandMap = {};

  const bandRanges = {
    "Critical": "0–30",
    "RISK": "30–45",
    "Healthy": "45–60",
    "SAFE": "60–90",
    "WATCH": "90–120",
    "Overstock": "120+"
  };

  for (const sku in computedStore.skuSCBand) {

    const band = computedStore.skuSCBand[sku].band;

    if (!bandMap[band]) {
      bandMap[band] = {
        band: band,
        range: bandRanges[band],
        skuCount: 0
      };
    }

    bandMap[band].skuCount += 1;
  }

  computedStore.summaries.scBandSummary = bandMap;
}
