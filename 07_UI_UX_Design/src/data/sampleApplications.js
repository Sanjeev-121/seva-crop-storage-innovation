// ============================================================
// SAMPLE APPLICATIONS - NOT REAL.
// These belong only to the built-in demo farmer.
// BACKEND TODO: replace with applications loaded from a server.
// ============================================================

// The steps shown in the status timeline (a rejected application
// is shown separately in red).
export const APPLICATION_STEPS = ["Submitted", "Under Review", "Approved"];

export const SAMPLE_APPLICATIONS = [
  {
    id: "DEMO-1001",
    userId: "demo-farmer",
    storageId: "cs-001",
    storageName: "Green Valley Cold Storage",
    crop: "Potato",
    quantityQuintals: 120,
    durationMonths: 4,
    estimatedCost: 8640,
    submittedOn: "2026-10-02",
    status: "Approved",
    notes: "Sample application.",
    isDemo: true,
  },
  {
    id: "DEMO-1002",
    userId: "demo-farmer",
    storageId: "cs-002",
    storageName: "Kisanpur Agro Chill Hub",
    crop: "Onion",
    quantityQuintals: 80,
    durationMonths: 3,
    estimatedCost: 5280,
    submittedOn: "2026-10-20",
    status: "Under Review",
    notes: "Sample application.",
    isDemo: true,
  },
  {
    id: "DEMO-1003",
    userId: "demo-farmer",
    storageId: "cs-006",
    storageName: "Dhanpur Cool Chain Centre",
    crop: "Tomato",
    quantityQuintals: 40,
    durationMonths: 2,
    estimatedCost: 2400,
    submittedOn: "2026-11-05",
    status: "Submitted",
    notes: "Sample application.",
    isDemo: true,
  },
  {
    id: "DEMO-1004",
    userId: "demo-farmer",
    storageId: "cs-004",
    storageName: "Fasalpur Farmers' Cold Store",
    crop: "Potato",
    quantityQuintals: 200,
    durationMonths: 5,
    estimatedCost: 15000,
    submittedOn: "2026-09-15",
    status: "Rejected",
    rejectionReason: "Sample reason: the storage was full.",
    notes: "Sample application.",
    isDemo: true,
  },
];