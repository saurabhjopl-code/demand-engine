import { computedStore } from "../store/computed.store.js";

export function calculateTotalDays(saleDaysData) {

  if (!saleDaysData || saleDaysData.length === 0) {
    computedStore.totalDays = 0;
    return;
  }

  const total = saleDaysData.reduce((sum, row) => {
    return sum + Number(row["Days"] || 0);
  }, 0);

  computedStore.totalDays = total;
}
