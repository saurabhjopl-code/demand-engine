export const computedStore = {

  skuSales: {},
  styleSales: {},
  totalDays: 0,

  skuDRR: {},
  styleDRR: {},

  skuDemand: {},

  clear() {
    this.skuSales = {};
    this.styleSales = {};
    this.totalDays = 0;
    this.skuDRR = {};
    this.styleDRR = {};
    this.skuDemand = {};
  }

};
