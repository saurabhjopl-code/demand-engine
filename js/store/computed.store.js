export const computedStore = {

  skuSales: {},
  styleSales: {},
  totalDays: 0,

  skuDRR: {},
  styleDRR: {},

  clear() {
    this.skuSales = {};
    this.styleSales = {};
    this.totalDays = 0;
    this.skuDRR = {};
    this.styleDRR = {};
  }

};
