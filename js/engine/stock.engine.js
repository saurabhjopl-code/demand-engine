import { computedStore } from "../store/computed.store.js";

export function consolidateStock(stockData) {

  if (!stockData || stockData.length === 0) {
    return;
  }

  const stockMap = {};

  for (const row of stockData) {

    const sku = row["Uniware SKU"];
    const units = Number(row["Units"] || 0);

    if (!sku) continue;

    if (!stockMap[sku]) {
      stockMap[sku] = {
        uniwareSKU: sku,
        totalStock: 0
      };
    }

    stockMap[sku].totalStock += units;
  }

  computedStore.skuStock = stockMap;
}
