import { DEMO_FARMER, DEMO_PIN } from "../data/demoAccount.js";
import { SAMPLE_APPLICATIONS } from "../data/sampleApplications.js";
import { calculateEstimatedCost } from "./format.js";

// ============================================================
// FRONTEND DEMO ONLY.
// Data is saved in this browser's localStorage, so it is not
// secure, not shared between devices, and not real.
// BACKEND TODO: replace each function with real API calls.
// ============================================================

const KEYS = {
  users: "cropstorage_demo_users",
  session: "cropstorage_demo_session",
  applications: "cropstorage_demo_applications",
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

function todayISO() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

// ---------- Users (demo registration) ----------

function getSavedUsers() {
  return readJSON(KEYS.users, []);
}

export function findUserByPhone(phone) {
  const cleanPhone = phone.trim();
  if (cleanPhone === DEMO_FARMER.phone) return DEMO_FARMER;
  return getSavedUsers().find((user) => user.phone === cleanPhone);
}

function findUserById(id) {
  if (id === DEMO_FARMER.id) return DEMO_FARMER;
  return getSavedUsers().find((user) => user.id === id);
}

export function registerUser(values) {
  const phone = values.phone.trim();

  if (findUserByPhone(phone)) {
    return {
      ok: false,
      error: "This mobile number is already registered in this demo. Please log in instead.",
    };
  }

  const newUser = {
    id: "user-" + Date.now(),
    fullName: values.fullName.trim(),
    phone,
    village: values.village.trim(),
    district: values.district,
    landAcres: Number(values.landAcres),
    mainCrop: values.mainCrop,
    createdOn: todayISO(),
    isDemo: true,
  };

  const saved = writeJSON(KEYS.users, [...getSavedUsers(), newUser]);
  if (!saved) {
    return {
      ok: false,
      error: "Could not save in this browser. Storage may be blocked or full.",
    };
  }
  return { ok: true, user: newUser };
}

// ---------- Session (demo login) ----------

export function loginDemo(phone, pin) {
  const user = findUserByPhone(phone);
  if (!user) {
    return {
      ok: false,
      error: "No farmer found with this number. Please register first, or use the demo number shown above.",
    };
  }
  if (pin.trim() !== DEMO_PIN) {
    return { ok: false, error: `Wrong demo PIN. The demo PIN is ${DEMO_PIN}.` };
  }
  writeJSON(KEYS.session, { userId: user.id });
  return { ok: true, user };
}

export function getCurrentUser() {
  const session = readJSON(KEYS.session, null);
  if (!session) return null;
  return findUserById(session.userId) || null;
}

export function logoutDemo() {
  try {
    localStorage.removeItem(KEYS.session);
  } catch (error) {
    // ignore
  }
}

// ---------- Applications (demo) ----------

function getSavedApplications() {
  return readJSON(KEYS.applications, []);
}

export function getApplicationsForUser(userId) {
  const seeded = userId === DEMO_FARMER.id ? SAMPLE_APPLICATIONS : [];
  const saved = getSavedApplications().filter((app) => app.userId === userId);
  return [...seeded, ...saved].sort((a, b) =>
    b.submittedOn.localeCompare(a.submittedOn)
  );
}

export function createApplication(userId, values, storage) {
  const quantity = Number(values.quantityQuintals);
  const months = Number(values.durationMonths);

  const application = {
    id: "DEMO-" + String(Date.now()).slice(-6),
    userId,
    storageId: storage.id,
    storageName: storage.name,
    crop: values.crop,
    quantityQuintals: quantity,
    durationMonths: months,
    estimatedCost: calculateEstimatedCost(
      storage.chargePerQuintalPerMonth,
      quantity,
      months
    ),
    submittedOn: todayISO(),
    status: "Submitted",
    notes: "Demo application saved only in this browser.",
    isDemo: true,
  };

  const saved = writeJSON(KEYS.applications, [...getSavedApplications(), application]);
  if (!saved) {
    return { ok: false, error: "Could not save in this browser. Storage may be blocked or full." };
  }
  return { ok: true, application };
}

// ---------- Reset ----------

export function resetDemoData() {
  try {
    localStorage.removeItem(KEYS.users);
    localStorage.removeItem(KEYS.applications);
    localStorage.removeItem(KEYS.session);
  } catch (error) {
    // ignore
  }
}