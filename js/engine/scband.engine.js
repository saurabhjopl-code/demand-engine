import { computedStore } from "../store/computed.store.js";

export function calculateSCBand() {

  const bandMap = {};

  for (const sku in computedStore.skuSC) {

    const sc = computedStore.skuSC[sku].sc || 0;
    let band = "Critical";

    if (sc >= 120) {
      band = "Overstock";
    } else if (sc >= 90) {
      band = "WATCH";
    } else if (sc >= 60) {
      band = "SAFE";
    } else if (sc >= 45) {
      band = "Healthy";
    } else if (sc >= 30) {
      band = "RISK";
    } else {
      band = "Critical";
    }

    bandMap[sku] = {
      uniwareSKU: sku,
      sc: sc,
      band: band
    };
  }

  computedStore.skuSCBand = bandMap;
}
