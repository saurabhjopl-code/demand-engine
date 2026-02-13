import { computedStore } from "../store/computed.store.js";

export function buildSummaries() {

  buildSaleDetailsSummary();
  buildStockOverviewSummary();
  buildSCBandSummary();
}

/* ======================================
   1️⃣ SALE DETAILS SUMMARY
====================================== */

function buildSaleDetailsSummary() {

  let totalUnits = 0;

  for (const sku in computedStore.skuSales) {
    totalUnits += computedStore.skuSales[sku].totalUnits;
  }

  const totalDays = computedStore.totalDays;

  const overallDRR =
    totalDays > 0 ? Number((totalUnits / totalDays).toFixed(4)) : 0;

  computedStore.summaries.saleDetails = {
    totalUnitsSold: totalUnits,
    totalDays: totalDays,
    overallDRR: overallDRR
  };
}

/* ======================================
   2️⃣ STOCK OVERVIEW SUMMARY
====================================== */

function buildStockOverviewSummary() {

  let totalStock = 0;
  let totalUnits = 0;

  for (const sku in computedStore.skuStock) {
    totalStock += computedStore.skuStock[sku].totalStock;
  }

  for (const sku in computedStore.skuSales) {
    totalUnits += computedStore.skuSales[sku].totalUnits;
  }

  const totalDays = computedStore.totalDays;

  const overallDRR =
    totalDays > 0 ? totalUnits / totalDays : 0;

  const overallSC =
    overallDRR > 0 ? Number((totalStock / overallDRR).toFixed(2)) : 0;

  computedStore.summaries.stockOverview = {
    totalStock: totalStock,
    totalUnitsSold: totalUnits,
    overallDRR: Number(overallDRR.toFixed(4)),
    overallSC: overallSC
  };
}

/* ======================================
   3️⃣ SC BAND SUMMARY
====================================== */

function buildSCBandSummary() {

  const bandMap = {};

  for (const sku in computedStore.skuSCBand) {

    const band = computedStore.skuSCBand[sku].band;
    const salesObj = computedStore.skuSales[sku];
    const stockObj = computedStore.skuStock[sku];

    if (!bandMap[band]) {
      bandMap[band] = {
        band: band,
        skuCount: 0,
        totalUnitsSold: 0,
        totalStock: 0
      };
    }

    bandMap[band].skuCount += 1;

    if (salesObj) {
      bandMap[band].totalUnitsSold += salesObj.totalUnits;
    }

    if (stockObj) {
      bandMap[band].totalStock += stockObj.totalStock;
    }
  }

  computedStore.summaries.scBandSummary = bandMap;
}
