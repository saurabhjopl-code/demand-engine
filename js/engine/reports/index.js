import { buildOverstockReport } from "./overstock.engine.js";

export function buildReports() {
  buildDemandReport();
  buildOverstockReport();
}
