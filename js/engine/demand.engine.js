import { computedStore } from "../store/computed.store.js";

export function calculateDemandCover() {

  const skuDemandMap = {};

  for (const sku in computedStore.skuDRR) {

    const drr = computedStore.skuDRR[sku].drr || 0;

    skuDemandMap[sku] = {
      uniwareSKU: sku,
      demand45: Number((drr * 45).toFixed(2)),
      demand60: Number((drr * 60).toFixed(2)),
      demand90: Number((drr * 90).toFixed(2))
    };
  }

  computedStore.skuDemand = skuDemandMap;
}
