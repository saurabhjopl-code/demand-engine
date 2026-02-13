import { computedStore } from "../store/computed.store.js";

export function calculateBuyBucket() {

  const bucketMap = {};

  for (const sku in computedStore.skuSCBand) {

    const bandObj = computedStore.skuSCBand[sku];
    const directObj = computedStore.skuDirectDemand[sku];

    const band = bandObj ? bandObj.band : "Critical";
    const directDemand = directObj ? directObj.directDemand : 0;

    let bucket = "NO BUY";

    // If no demand → no buy
    if (directDemand <= 0) {
      bucket = "NO BUY";
    } else {

      switch (band) {
        case "Critical":
          bucket = "URGENT";
          break;
        case "RISK":
          bucket = "HIGH";
          break;
        case "Healthy":
          bucket = "NORMAL";
          break;
        case "SAFE":
          bucket = "SAFE";
          break;
        case "WATCH":
          bucket = "LOW";
          break;
        case "Overstock":
          bucket = "NO BUY";
          break;
        default:
          bucket = "NO BUY";
      }
    }

    bucketMap[sku] = {
      uniwareSKU: sku,
      band: band,
      directDemand: directDemand,
      bucket: bucket
    };
  }

  computedStore.skuBuyBucket = bucketMap;
}
