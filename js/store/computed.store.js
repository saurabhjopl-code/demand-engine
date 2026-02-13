export const computedStore = {

  skuSales: {},
  styleSales: {},
  totalDays: 0,

  skuDRR: {},
  styleDRR: {},

  skuDemand: {},

  skuStock: {},
  skuSC: {},

  clear() {
    this.skuSales = {};
    this.styleSales = {};
    this.totalDays = 0;
    this.skuDRR = {};
    this.styleDRR = {};
    this.skuDemand = {};
    this.skuStock = {};
    this.skuSC = {};
  }

};
