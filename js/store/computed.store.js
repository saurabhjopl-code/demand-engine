export const computedStore = {

  skuSales: {},
  styleSales: {},
  totalDays: 0,

  skuDRR: {},
  styleDRR: {},

  skuDemand: {},

  skuStock: {},
  skuSC: {},
  skuSCBand: {},

  skuProduction: {},
  skuDirectDemand: {},

  skuBuyBucket: {},

  clear() {
    this.skuSales = {};
    this.styleSales = {};
    this.totalDays = 0;
    this.skuDRR = {};
    this.styleDRR = {};
    this.skuDemand = {};
    this.skuStock = {};
    this.skuSC = {};
    this.skuSCBand = {};
    this.skuProduction = {};
    this.skuDirectDemand = {};
    this.skuBuyBucket = {};
  }

};
