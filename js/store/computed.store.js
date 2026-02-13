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

  summaries: {
    saleDetails: {},
    stockOverview: {},
    scBandSummary: {}
  },

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
    this.summaries = {
      saleDetails: {},
      stockOverview: {},
      scBandSummary: {}
    };
  }

};
