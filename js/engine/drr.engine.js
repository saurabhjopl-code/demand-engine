import { computedStore } from "../store/computed.store.js";

export function calculateDRR() {

  const totalDays = computedStore.totalDays;

  if (!totalDays || totalDays <= 0) {
    computedStore.skuDRR = {};
    computedStore.styleDRR = {};
    return;
  }

  const skuDRRMap = {};
  const styleDRRMap = {};

  // SKU Level DRR
  for (const sku in computedStore.skuSales) {

    const totalUnits = computedStore.skuSales[sku].totalUnits;
    const drr = totalUnits / totalDays;

    skuDRRMap[sku] = {
      uniwareSKU: sku,
      drr: Number(drr.toFixed(4))
    };
  }

  // Style Level DRR
  for (const style in computedStore.styleSales) {

    const totalUnits = computedStore.styleSales[style].totalUnits;
    const drr = totalUnits / totalDays;

    styleDRRMap[style] = {
      styleID: style,
      drr: Number(drr.toFixed(4))
    };
  }

  computedStore.skuDRR = skuDRRMap;
  computedStore.styleDRR = styleDRRMap;
}
