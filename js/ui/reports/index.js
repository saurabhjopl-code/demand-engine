import { renderOverstockReport } from "./overstock.binding.js";

export function renderReports() {
  renderDemandReport();
  renderOverstockReport();
}
