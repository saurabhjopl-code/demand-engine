export const dataStore = {
  raw: {},

  set(sheetName, data) {
    this.raw[sheetName] = Object.freeze(data);
  },

  get(sheetName) {
    return this.raw[sheetName];
  },

  clear() {
    this.raw = {};
  }
};
