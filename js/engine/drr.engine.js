import { dataStore } from "../store/data.store.js";
import { computedStore } from "../store/computed.store.js";
import { consolidateSales } from "./sales.engine.js";
import { calculateTotalDays } from "./days.engine.js";
import { calculateDRR } from "./drr.engine.js";

export function initializeEngine() {

  // Clear previous computed data
  computedStore.clear();

  const salesData = dataStore.get("Sales");
  const saleDaysData = dataStore.get("Sale Days");

  // STEP 1 — Consolidation
  consolidateSales(salesData);

  // STEP 2 — Total Days
  calculateTotalDays(saleDaysData);

  // STEP 3 — DRR
  calculateDRR();

  // Debug Logs (Safe)
  console.log("Engine Initialized");
  console.log("Total Days:", computedStore.totalDays);
  console.log("SKU Count:", Object.keys(computedStore.skuSales).length);
  console.log("Style Count:", Object.keys(computedStore.styleSales).length);
}
