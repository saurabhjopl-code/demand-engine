import { computedStore } from "../store/computed.store.js";

export function calculateStockCover() {

  const scMap = {};

  for (const sku in computedStore.skuStock) {

    const stock = computedStore.skuStock[sku].totalStock || 0;
    const drrObj = computedStore.skuDRR[sku];
    const drr = drrObj ? drrObj.drr : 0;

    let sc = 0;

    if (drr > 0) {
      sc = stock / drr;
    }

    scMap[sku] = {
      uniwareSKU: sku,
      sc: Number(sc.toFixed(2))
    };
  }

  computedStore.skuSC = scMap;
}
