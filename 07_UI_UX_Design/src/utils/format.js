export function formatCurrency(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

export function formatDate(isoDate) {
  if (!isoDate) return "-";
  const date = new Date(isoDate + "T00:00:00");
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function calculateEstimatedCost(chargePerQuintalPerMonth, quintals, months) {
  return chargePerQuintalPerMonth * quintals * months;
}

export function getPercentFilled(storage) {
  const used = storage.totalCapacityQuintals - storage.availableQuintals;
  return Math.round((used / storage.totalCapacityQuintals) * 100);
}

// Returns a label and badge colour class for a storage's sample availability
export function getAvailability(storage) {
  if (storage.availableQuintals <= 0) {
    return { label: "Full (sample)", badge: "badge-red", level: "full" };
  }
  if (getPercentFilled(storage) >= 85) {
    return { label: "Limited space (sample)", badge: "badge-amber", level: "high" };
  }
  return { label: "Space available (sample)", badge: "badge-green", level: "ok" };
}