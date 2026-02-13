import { dataStore } from "../store/data.store.js";
import { computedStore } from "../store/computed.store.js";
import { consolidateSales } from "./sales.engine.js";
import { calculateTotalDays } from "./days.engine.js";
import { calculateDRR } from "./drr.engine.js";
import { calculateDemandCover } from "./demand.engine.js";
import { consolidateStock } from "./stock.engine.js";
import { calculateStockCover } from "./sc.engine.js";
import { calculateSCBand } from "./scband.engine.js";

export function initializeEngine() {

  // Clear previous computed data
  computedStore.clear();

  const salesData = dataStore.get("Sales");
  const saleDaysData = dataStore.get("Sale Days");
  const stockData = dataStore.get("Stock");

  // STEP 1 — Consolidate Sales
  consolidateSales(salesData);

  // STEP 2 — Calculate Total Days
  calculateTotalDays(saleDaysData);

  // STEP 3 — Calculate DRR
  calculateDRR();

  // STEP 4 — Demand Cover
  calculateDemandCover();

  // STEP 5 — Consolidate Stock
  consolidateStock(stockData);

  // STEP 6 — Stock Cover
  calculateStockCover();

  // STEP 7 — SC Band Classification
  calculateSCBand();

  // Debug Logs
  console.log("Engine Initialized");
  console.log("Total Days:", computedStore.totalDays);
  console.log("SKU Count:", Object.keys(computedStore.skuSales).length);
  console.log("SC Band Entries:", Object.keys(computedStore.skuSCBand).length);
}
