import { dataStore } from "../store/data.store.js";
import { computedStore } from "../store/computed.store.js";

/* ======================================================
   MASTER CORE ENGINE
   (Builds ALL SKU-level computed values)
====================================================== */

export function buildCoreEngine() {

  buildTotalDays();
  buildSkuSales();
  buildSkuStock();
  buildSkuProduction();
  buildSkuSC();
}

/* ==========================================
   1️⃣ TOTAL SALE DAYS
========================================== */

function buildTotalDays() {

  const saleDaysData = dataStore.get("Sale Days") || [];

  let totalDays = 0;

  saleDaysData.forEach(row => {
    totalDays += Number(row["Days"] || 0);
  });

  computedStore.totalDays = totalDays;
}

/* ==========================================
   2️⃣ SKU SALES CONSOLIDATION
========================================== */

function buildSkuSales() {

  const salesData = dataStore.get("Sales") || [];
  const skuMap = {};

  salesData.forEach(row => {

    const sku = row["Uniware SKU"];
    const styleID = row["Style ID"];
    const units = Number(row["Units"] || 0);

    if (!sku) return;

    if (!skuMap[sku]) {
      skuMap[sku] = {
        sku,
        styleID,
        totalUnits: 0
      };
    }

    skuMap[sku].totalUnits += units;
  });

  computedStore.skuSales = skuMap;
}

/* ==========================================
   3️⃣ SKU STOCK CONSOLIDATION
========================================== */

function buildSkuStock() {

  const stockData = dataStore.get("Stock") || [];
  const skuMap = {};

  stockData.forEach(row => {

    const sku = row["Uniware SKU"];
    const units = Number(row["Units"] || 0);

    if (!sku) return;

    if (!skuMap[sku]) {
      skuMap[sku] = {
        sku,
        totalStock: 0
      };
    }

    skuMap[sku].totalStock += units;
  });

  computedStore.skuStock = skuMap;
}

/* ==========================================
   4️⃣ SKU PRODUCTION
========================================== */

function buildSkuProduction() {

  const productionData = dataStore.get("Production") || [];
  const skuMap = {};

  productionData.forEach(row => {

    const sku = row["Uniware SKU"];
    const units = Number(row["In Production"] || 0);

    if (!sku) return;

    if (!skuMap[sku]) {
      skuMap[sku] = {
        sku,
        inProduction: 0
      };
    }

    skuMap[sku].inProduction += units;
  });

  computedStore.skuProduction = skuMap;
}

/* ==========================================
   5️⃣ SKU DRR + SC CALCULATION
========================================== */

function buildSkuSC() {

  const skuSales = computedStore.skuSales || {};
  const skuStock = computedStore.skuStock || {};
  const totalDays = computedStore.totalDays || 0;

  const skuSCMap = {};

  const allSkus = new Set([
    ...Object.keys(skuSales),
    ...Object.keys(skuStock)
  ]);

  allSkus.forEach(sku => {

    const totalUnits = skuSales[sku]?.totalUnits || 0;
    const totalStock = skuStock[sku]?.totalStock || 0;

    const drr = totalDays > 0
      ? Number((totalUnits / totalDays).toFixed(2))
      : 0;

    const sc = drr > 0
      ? Math.round(totalStock / drr)
      : 0;

    skuSCMap[sku] = {
      sku,
      totalUnits,
      totalStock,
      drr,
      sc
    };
  });

  computedStore.skuSC = skuSCMap;
}
