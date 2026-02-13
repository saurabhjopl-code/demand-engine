const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const refreshBtn = document.getElementById("refreshBtn");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const sheetInfo = document.getElementById("sheetInfo");
const demandTable = document.getElementById("demandTable");
const buyBucketTable = document.getElementById("buyBucketTable");

/* SEARCH CLEAR */
searchInput.addEventListener("input", () => {
  clearSearch.style.display = searchInput.value ? "block" : "none";
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  clearSearch.style.display = "none";
});

/* REFRESH SIMULATION */
refreshBtn.addEventListener("click", () => {

  // Reset search
  searchInput.value = "";
  clearSearch.style.display = "none";

  // Reset progress
  progressBar.style.width = "0%";
  progressText.textContent = "0%";

  // Reset sheet info
  sheetInfo.textContent =
    "Sales: 0 | Stock: 0 | Style Status: 0 | Sale Days: 0 | " +
    "Size Count: 0 | Production: 0 | Meter Calc: 0 | " +
    "Location: 0 | X Mark Up: 0";

  // Reset tables
  demandTable.querySelector("tbody").innerHTML =
    `<tr>
      <td>Sample SKU</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>`;

  buyBucketTable.querySelector("tbody").innerHTML =
    `<tr>
      <td>Critical</td>
      <td>0</td>
    </tr>`;

  // Simulate reload animation
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    progressBar.style.width = progress + "%";
    progressText.textContent = progress + "%";

    if (progress >= 100) {
      clearInterval(interval);
    }
  }, 80);

});
