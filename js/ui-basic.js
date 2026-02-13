document.addEventListener("DOMContentLoaded", () => {

  const tabs = document.querySelectorAll(".tab");

  const demandSection = document.getElementById("demandSection");
  const overstockSection = document.getElementById("overstockSection");

  const searchInput = document.getElementById("searchInput");
  const clearSearch = document.getElementById("clearSearch");

  /* SEARCH CLEAR */
  searchInput.addEventListener("input", () => {
    clearSearch.style.display = searchInput.value ? "block" : "none";
  });

  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    clearSearch.style.display = "none";
  });

  /* TAB SWITCHING */
  tabs.forEach(tab => {

    tab.addEventListener("click", () => {

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      demandSection.style.display = "none";
      overstockSection.style.display = "none";

      const selected = tab.dataset.tab;

      if (selected === "demand") {
        demandSection.style.display = "block";
      }

      if (selected === "overstock") {
        overstockSection.style.display = "block";
      }

    });

  });

});
