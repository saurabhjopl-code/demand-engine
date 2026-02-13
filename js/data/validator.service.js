const EXPECTED_HEADERS = {
  "Sales": ["Month","MP","Account","FC","MP SKU","Uniware SKU","Style ID","Size","Units"],
  "Stock": ["FC","MP SKU","Uniware SKU","Style ID","Size","Units"],
  "Style Status": ["Style ID","Category","Company Remark"],
  "Sale Days": ["Month","Days"],
  "Size Count": ["Style ID","Size Count"],
  "Production": ["Uniware SKU","In Production"],
  "Meter Calc": ["Uniware SKU","Size","TOP (M)","BOTTOM (M)","DUPATTA (M)"],
  "Location": ["Uniware SKU","Location"],
  "X Mark Up": ["Company Remark","Surat","Jaipur"]
};

export function validateHeaders(sheetName, headers) {
  const expected = EXPECTED_HEADERS[sheetName];

  if (!expected) {
    throw new Error("No header rule for sheet: " + sheetName);
  }

  const mismatch =
    expected.length !== headers.length ||
    !expected.every((h, i) => h === headers[i]);

  if (mismatch) {
    alert(`Header mismatch in sheet: ${sheetName}`);
    throw new Error("Header validation failed");
  }
}
