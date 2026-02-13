export async function fetchSheet(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch sheet");
  }
  return await response.text();
}
