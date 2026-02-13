import { computedStore } from "../store/computed.store.js";

export function calculateDirectDemand() {

  const resultMap = {};

  for (const sku in computedStore.skuDemand) {

    const demand90 = computedStore.skuDemand[sku].demand90 || 0;

    const stockObj = computedStore.skuStock[sku];
    const stock = stockObj ? stockObj.totalStock : 0;

    const productionObj = computedStore.skuProduction[sku];
    const production = productionObj ? productionObj.inProduction : 0;

    // Direct Demand
    let directDemand = demand90 - stock;
    if (directDemand < 0) directDemand = 0;

    // Pendancy
    let pendancy = directDemand - production;
    if (pendancy < 0) pendancy = 0;

    // Remark
    let remark = "";
    if (production > demand90) {
      remark = "Over Production";
    }

    resultMap[sku] = {
      uniwareSKU: sku,
      demand90: demand90,
      totalStock: stock,
      inProduction: production,
      directDemand: Number(directDemand.toFixed(2)),
      pendancy: Number(pendancy.toFixed(2)),
      remark: remark
    };
  }

  computedStore.skuDirectDemand = resultMap;
}
