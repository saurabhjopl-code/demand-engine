import { computedStore } from "../store/computed.store.js";

export function consolidateSales(salesData) {

  if (!salesData || salesData.length === 0) {
    return;
  }

  const skuMap = {};
  const styleMap = {};

  for (const row of salesData) {

    const sku = row["Uniware SKU"];
    const style = row["Style ID"];
    const units = Number(row["Units"] || 0);

    if (!sku) continue;

    // SKU-level consolidation
    if (!skuMap[sku]) {
      skuMap[sku] = {
        uniwareSKU: sku,
        styleID: style,
        totalUnits: 0
      };
    }

    skuMap[sku].totalUnits += units;

    // Style-level consolidation
    if (style) {
      if (!styleMap[style]) {
        styleMap[style] = {
          styleID: style,
          totalUnits: 0
        };
      }

      styleMap[style].totalUnits += units;
    }
  }

  computedStore.skuSales = skuMap;
  computedStore.styleSales = styleMap;
}
