export function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());

  const rows = lines.slice(1).map(line => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index]?.trim() || "";
    });
    return obj;
  });

  return { headers, rows };
}
