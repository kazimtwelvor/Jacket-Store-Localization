export function filterPayPalResponse(response: any) {
  if (!response || typeof response !== "object") return response;

  const filtered = { ...response };

  // Remove payee information from purchase_units
  if (filtered.purchase_units && Array.isArray(filtered.purchase_units)) {
    filtered.purchase_units = filtered.purchase_units.map((unit: any) => {
      const { payee, ...filteredUnit } = unit;
      return filteredUnit;
    });
  }

  return filtered;
}
