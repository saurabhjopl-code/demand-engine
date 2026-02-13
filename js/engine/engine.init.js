import { dataStore } from "../store/data.store.js";
import { computedStore } from "../store/computed.store.js";
import { consolidateSales } from "./sales.engine.js";
import { calculateTotalDays } from "./days.engine.js";

export function initializeEngine() {

  // Clear previous computed data
  computedStore.clear();

  const salesData = dataStore.get("Sales");
  const saleDaysData = dataStore.get("Sale Days");

  // Run engines
  consolidateSales(salesData);
  calculateTotalDays(saleDaysData);

  // Debug (safe)
  console.log("Engine Initialized");
  console.log("Total Days:", computedStore.totalDays);
  console.log("SKU Sales Count:", Object.keys(computedStore.skuSales).length);
}
