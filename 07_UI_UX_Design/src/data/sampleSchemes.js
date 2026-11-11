// ============================================================
// SAMPLE SUMMARIES - NOT OFFICIAL TEXT.
// These are short, general descriptions for a student prototype.
// Rules, amounts and dates change. Always verify on the official
// government website before relying on any of this.
// BACKEND/CONTENT TODO: replace with verified, up-to-date content.
// ============================================================

export const SCHEMES_DISCLAIMER =
  "These are general sample summaries, not official information. Please check the official government website or your local agriculture office for current rules, amounts and dates.";

export const SCHEME_CATEGORIES = [
  "All",
  "Income support",
  "Credit",
  "Storage infrastructure",
  "Market access",
  "Insurance",
];

export const SAMPLE_SCHEMES = [
  {
    id: "sch-1",
    name: "PM-KISAN (Income Support)",
    category: "Income support",
    summary:
      "A central government scheme that gives income support to eligible farmer families in instalments.",
    benefits: [
      "Direct bank transfer to eligible farmers",
      "Helps with farming expenses",
    ],
    whoCanApply: ["Farmer families that meet the official land and eligibility rules"],
    documents: ["Identity proof", "Land records", "Bank passbook", "Mobile number"],
    howToApply: [
      "Visit the official scheme portal or your nearest common service centre",
      "Fill in your details and upload documents",
      "Check your application status on the portal",
    ],
  },
  {
    id: "sch-2",
    name: "Kisan Credit Card (KCC)",
    category: "Credit",
    summary:
      "A credit facility that helps farmers get short-term loans for farming needs at easier terms.",
    benefits: [
      "Easier access to farm credit",
      "Flexible repayment linked to harvest",
    ],
    whoCanApply: ["Farmers, tenant farmers and sharecroppers as per bank rules"],
    documents: ["Identity proof", "Address proof", "Land or lease records", "Photographs"],
    howToApply: [
      "Visit your nearest bank branch",
      "Ask for the Kisan Credit Card form",
      "Submit documents and follow up with the bank",
    ],
  },
  {
    id: "sch-3",
    name: "Agriculture Infrastructure Fund",
    category: "Storage infrastructure",
    summary:
      "A financing facility for farm-gate and post-harvest infrastructure such as cold storage and warehouses.",
    benefits: [
      "Loan support for storage and processing projects",
      "Useful for farmer groups and co-operatives",
    ],
    whoCanApply: ["Farmers, farmer groups, co-operatives and agri-entrepreneurs as per official rules"],
    documents: ["Project report", "Identity proof", "Land or lease papers", "Bank details"],
    howToApply: [
      "Read the official guidelines on the scheme portal",
      "Prepare a simple project report",
      "Apply through the portal or a participating bank",
    ],
  },
  {
    id: "sch-4",
    name: "Horticulture Development Mission (Cold Storage Support)",
    category: "Storage infrastructure",
    summary:
      "A mission that supports horticulture growth, including help for post-harvest facilities like cold storage.",
    benefits: [
      "Support for fruit and vegetable value chains",
      "Assistance for post-harvest infrastructure",
    ],
    whoCanApply: ["Eligible farmers, groups and entrepreneurs as per state guidelines"],
    documents: ["Identity proof", "Land records", "Bank passbook", "Project details"],
    howToApply: [
      "Contact your district horticulture office",
      "Ask which components are open in your state",
      "Submit the application as guided by the office",
    ],
  },
  {
    id: "sch-5",
    name: "e-NAM (Online Market Access)",
    category: "Market access",
    summary:
      "An online trading platform that links farmers to mandis and buyers so they can compare prices.",
    benefits: [
      "See prices from more markets",
      "Sell to more buyers",
    ],
    whoCanApply: ["Farmers who register through a connected mandi"],
    documents: ["Identity proof", "Bank passbook", "Mobile number"],
    howToApply: [
      "Visit a mandi that is connected to the platform",
      "Register as a farmer with the mandi office",
      "Use the platform with their guidance",
    ],
  },
  {
    id: "sch-6",
    name: "Crop Insurance Scheme (PMFBY)",
    category: "Insurance",
    summary:
      "A crop insurance scheme that protects farmers from losses caused by events such as bad weather, pests or disease.",
    benefits: [
      "Financial protection against crop loss",
      "Premium support from government",
    ],
    whoCanApply: ["Farmers growing notified crops in notified areas"],
    documents: ["Identity proof", "Land records", "Bank passbook", "Sowing details"],
    howToApply: [
      "Apply through your bank, a common service centre or the official portal",
      "Apply before the last date for your crop season",
      "Keep your receipt safely",
    ],
  },
];