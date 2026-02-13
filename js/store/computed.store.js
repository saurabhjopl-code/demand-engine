import { dataStore } from "../store/data.store.js";
import { computedStore } from "../store/computed.store.js";
import { consolidateSales } from "./sales.engine.js";
import { calculateTotalDays } from "./days.engine.js";
import { calculateDRR } from "./drr.engine.js";
import { calculateDemandCover } from "./demand.engine.js";
import { consolidateStock } from "./stock.engine.js";
import { calculateStockCover } from "./sc.engine.js";
import { calculateSCBand } from "./scband.engine.js";
import { consolidateProduction } from "./production.engine.js";
import { calculateDirectDemand } from "./directdemand.engine.js";
import { calculateBuyBucket } from "./buybucket.engine.js";

export function initializeEngine() {

  // Clear previous computed data
  computedStore.clear();

  const salesData = dataStore.get("Sales");
  const saleDaysData = dataStore.get("Sale Days");
  const stockData = dataStore.get("Stock");
  const productionData = dataStore.get("Production");

  // STEP 1 — Sales Consolidation
  consolidateSales(salesData);

  // STEP 2 — Total Days
  calculateTotalDays(saleDaysData);

  // STEP 3 — DRR
  calculateDRR();

  // STEP 4 — Demand Cover
  calculateDemandCover();

  // STEP 5 — Stock Consolidation
  consolidateStock(stockData);

  // STEP 6 — Stock Cover
  calculateStockCover();

  // STEP 7 — SC Band
  calculateSCBand();

  // STEP 8 — Production Consolidation
  consolidateProduction(productionData);

  // STEP 9 — Direct Demand & Pendancy
  calculateDirectDemand();

  // STEP 10 — Buy Bucket
  calculateBuyBucket();

  // Debug
  console.log("Engine Initialized");
  console.log("Total Days:", computedStore.totalDays);
  console.log("SKU Count:", Object.keys(computedStore.skuSales).length);
  console.log("Buy Bucket Entries:", Object.keys(computedStore.skuBuyBucket).length);
}
