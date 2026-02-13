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
import { buildSummaries } from "./summary.engine.js";
import { renderSummaries } from "../ui/summary.binding.js";

export function initializeEngine() {

  computedStore.clear();

  const salesData = dataStore.get("Sales");
  const saleDaysData = dataStore.get("Sale Days");
  const stockData = dataStore.get("Stock");
  const productionData = dataStore.get("Production");

  consolidateSales(salesData);
  calculateTotalDays(saleDaysData);
  calculateDRR();
  calculateDemandCover();
  consolidateStock(stockData);
  calculateStockCover();
  calculateSCBand();
  consolidateProduction(productionData);
  calculateDirectDemand();
  calculateBuyBucket();

  buildSummaries();

  // 🔥 NEW — Render to UI
  renderSummaries();

  console.log("Summaries Rendered");
}
