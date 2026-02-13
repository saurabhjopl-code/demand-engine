import { computedStore } from "../store/computed.store.js";

export function consolidateProduction(productionData) {

  if (!productionData || productionData.length === 0) {
    return;
  }

  const productionMap = {};

  for (const row of productionData) {

    const sku = row["Uniware SKU"];
    const units = Number(row["In Production"] || 0);

    if (!sku) continue;

    if (!productionMap[sku]) {
      productionMap[sku] = {
        uniwareSKU: sku,
        inProduction: 0
      };
    }

    productionMap[sku].inProduction += units;
  }

  computedStore.skuProduction = productionMap;
}
