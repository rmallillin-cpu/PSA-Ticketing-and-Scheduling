const STORAGE_KEYS = {
  users: "psa_users",
  session: "psa_session",
  events: "psa_events",
  tickets: "psa_tickets",
  chats: "psa_chats",
  accomplishments: "psa_accomplishments",
  attendance: "psa_attendance",
  announcements: "psa_announcements",
  ticketCounter: "psa_ticket_counter"
};
const SUPABASE_URL = "https://ofidtdjoqkcfprwtolms.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_uH7HGPtFNw468aoIFd8ZHQ_PCtMf-XL";
const CLOUD_STATE_TABLE = "portal_state";
const CLOUD_STATE_ROW_ID = 1;
const CLOUD_SYNC_KEYS = [
  STORAGE_KEYS.users,
  STORAGE_KEYS.events,
  STORAGE_KEYS.tickets,
  STORAGE_KEYS.chats,
  STORAGE_KEYS.accomplishments,
  STORAGE_KEYS.attendance,
  STORAGE_KEYS.announcements,
  STORAGE_KEYS.ticketCounter
];
const supabaseClient = window.supabase?.createClient
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : null;
let cloudUpdatedAt = "";
let cloudPushTimer = null;
let cloudPollingTimer = null;
let cloudBusy = false;
let cloudWarned = false;
const CLOUD_SETUP_HINT = "Cloud sync is offline. Run supabase-setup.sql in Supabase SQL Editor and refresh.";

const DEPARTMENTS = [
  "Statistical & Technical",
  "Civil Registration & Operations",
  "Administrative & Finance",
  "National ID"
];

const POSITIONS = [
  "Chief Statistical Specialist",
  "Supervising Statistical Specialist",
  "Senior Statistical Specialist",
  "Statistical Specialist II",
  "Statistical Specialist I",
  "Statistical Analyst",
  "Assistant Statistician",
  "Registration Officer II",
  "Registration Officer I",
  "Chief Administrative Officer",
  "Administrative Officer III",
  "Administrative Officer II",
  "Administrative Officer I",
  "Accountant III",
  "Accountant II",
  "Accountant I",
  "Information Systems Analyst I",
  "Information Officer I",
  "Administrative Assistant III",
  "Administrative Assistant II",
  "Administrative Assistant I",
  "Administrative Aide VI (Clerk III)",
  "Census Area Supervisor / Team Supervisor",
  "Enumerator",
  "Registration Kit Operator",
  "Registration Assistant",
  "Driver",
  "Coordinator Process Support",
  "Utilities",
  "On-The-Job-Training",
  "Assistant Birth Registration Coordinator"
];

const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMjAnIGhlaWdodD0nMTIwJz48cmVjdCB3aWR0aD0nMTIwJyBoZWlnaHQ9JzEyMCcgZmlsbD0nI2QxZTVmZicvPjxjaXJjbGUgY3g9JzYwJyBjeT0nNDYnIHI9JzIyJyBmaWxsPScjNzg5YWMwJy8+PHJlY3QgeD0nMjEnIHk9Jzc0JyB3aWR0aD0nNzgnIGhlaWdodD0nMzUnIHJ4PScxNycgZmlsbD0nIzc4OWFjMCcvPjwvc3ZnPg==";

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  scheduleCloudPush();
}

function getUsers() {
  return readStorage(STORAGE_KEYS.users, []);
}

function setUsers(users) {
  writeStorage(STORAGE_KEYS.users, users);
}

function getEvents() {
  return readStorage(STORAGE_KEYS.events, []);
}

function setEvents(events) {
  writeStorage(STORAGE_KEYS.events, events);
}

function getTickets() {
  return readStorage(STORAGE_KEYS.tickets, []);
}

function setTickets(tickets) {
  writeStorage(STORAGE_KEYS.tickets, tickets);
}

function getChats() {
  return readStorage(STORAGE_KEYS.chats, {});
}

function setChats(chats) {
  writeStorage(STORAGE_KEYS.chats, chats);
}

function getAccomplishments() {
  return readStorage(STORAGE_KEYS.accomplishments, []);
}

function setAccomplishments(reports) {
  writeStorage(STORAGE_KEYS.accomplishments, reports);
}

function getAttendance() {
  return readStorage(STORAGE_KEYS.attendance, []);
}

function setAttendance(entries) {
  writeStorage(STORAGE_KEYS.attendance, entries);
}

function getAnnouncements() {
  return readStorage(STORAGE_KEYS.announcements, []);
}

function setAnnouncements(items) {
  writeStorage(STORAGE_KEYS.announcements, items);
}

function logTimeIn(user) {
  const entries = getAttendance();
  entries.push({
    id: crypto.randomUUID(),
    userId: user.id,
    employeeCode: user.employeeCode || "",
    fullname: user.fullname,
    department: user.department,
    position: user.position,
    timeIn: new Date().toISOString(),
    timeOut: null
  });
  setAttendance(entries);
}

function logTimeOut(userId) {
  const entries = getAttendance();
  const latestOpen = entries
    .filter((entry) => entry.userId === userId && !entry.timeOut)
    .sort((a, b) => b.timeIn.localeCompare(a.timeIn))[0];

  if (!latestOpen) return;
  latestOpen.timeOut = new Date().toISOString();
  setAttendance(entries);
}

function getSession() {
  return readStorage(STORAGE_KEYS.session, null);
}

function setSession(user) {
  writeStorage(STORAGE_KEYS.session, {
    userId: user.id,
    role: user.role,
    username: user.username,
    at: new Date().toISOString()
  });
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  return getUsers().find((u) => u.id === session.userId) || null;
}

function ensureSeeds() {
  const users = getUsers();
  let changed = false;

  users.forEach((user, index) => {
    if (!user.employeeCode) {
      user.employeeCode = user.role === "admin" ? "ADM-0001" : `EMP-${String(index + 1).padStart(4, "0")}`;
      changed = true;
    }
  });

  const hasAdmin = users.some((u) => u.role === "admin");
  if (!hasAdmin) {
    users.push({
      id: crypto.randomUUID(),
      employeeCode: "ADM-0001",
      username: "admin",
      fullname: "PSA Administrator",
      email: "admin@psa.local",
      department: "Administration",
      position: "System Admin",
      password: "admin123",
      role: "admin",
      profilePicture: DEFAULT_AVATAR,
      createdAt: new Date().toISOString()
    });
    changed = true;
  }

  if (changed) setUsers(users);

  if (!localStorage.getItem(STORAGE_KEYS.ticketCounter)) {
    localStorage.setItem(STORAGE_KEYS.ticketCounter, "1");
    scheduleCloudPush();
  }
}

function getNextTicketNumber() {
  const counter = Number(localStorage.getItem(STORAGE_KEYS.ticketCounter) || "1");
  return `2026-${String(counter).padStart(4, "0")}`;
}

function incrementTicketCounter() {
  const counter = Number(localStorage.getItem(STORAGE_KEYS.ticketCounter) || "1");
  localStorage.setItem(STORAGE_KEYS.ticketCounter, String(counter + 1));
  scheduleCloudPush();
}

function formatDateKey(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function notify(message, type = "") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`.trim();
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 2800);
}

function formatDisplayName(fullname) {
  const clean = String(fullname || "").trim().replace(/\s+/g, " ");
  if (!clean) return "-";
  const parts = clean.split(" ");
  if (parts.length === 1) return parts[0].toUpperCase();
  const first = parts[0];
  const last = parts[parts.length - 1];
  const middle = parts.length > 2 ? `${parts[1][0] || ""}.` : "";
  return `${last.toUpperCase()}, ${first.toUpperCase()}${middle ? `, ${middle.toUpperCase()}` : ""}`;
}

async function bootstrapCloudState() {
  if (!supabaseClient || cloudBusy) {
    warnCloudOnce("Supabase client not available. Running local-only mode.");
    return false;
  }

  cloudBusy = true;
  try {
    await ensureCloudRow();
    const { data, error } = await supabaseClient
      .from(CLOUD_STATE_TABLE)
      .select("updated_at, data")
      .eq("id", CLOUD_STATE_ROW_ID)
      .single();

    if (error || !data) {
      warnCloudOnce(error?.message || CLOUD_SETUP_HINT);
      return false;
    }
    cloudUpdatedAt = data.updated_at || "";
    hydrateLocalStorageFromCloud(data.data || {});
    return true;
  } finally {
    cloudBusy = false;
  }
}

function startCloudPolling(onUpdate, intervalMs = 8000) {
  if (!supabaseClient) return;
  if (cloudPollingTimer) clearInterval(cloudPollingTimer);

  cloudPollingTimer = setInterval(async () => {
    const changed = await pullCloudStateIfNewer();
    if (changed && typeof onUpdate === "function") onUpdate();
  }, intervalMs);
}

function stopCloudPolling() {
  if (cloudPollingTimer) clearInterval(cloudPollingTimer);
  cloudPollingTimer = null;
}

function scheduleCloudPush(delayMs = 350) {
  if (!supabaseClient) return;
  if (cloudPushTimer) clearTimeout(cloudPushTimer);
  cloudPushTimer = setTimeout(() => {
    void pushCloudState();
  }, delayMs);
}

async function ensureCloudRow() {
  if (!supabaseClient) return;
  const defaults = {};
  CLOUD_SYNC_KEYS.forEach((key) => {
    defaults[key] = getParsedStorageValue(key);
  });

  const { error } = await supabaseClient
    .from(CLOUD_STATE_TABLE)
    .upsert(
      {
        id: CLOUD_STATE_ROW_ID,
        data: defaults
      },
      { onConflict: "id" }
    );

  if (error) {
    console.warn("Supabase init row error:", error.message);
    warnCloudOnce(error.message || CLOUD_SETUP_HINT);
  }
}

async function pushCloudState() {
  if (!supabaseClient || cloudBusy) return;
  cloudBusy = true;
  try {
    const localPayload = {};
    CLOUD_SYNC_KEYS.forEach((key) => {
      localPayload[key] = getParsedStorageValue(key);
    });

    const { data: remoteRow } = await supabaseClient
      .from(CLOUD_STATE_TABLE)
      .select("data")
      .eq("id", CLOUD_STATE_ROW_ID)
      .single();

    const remotePayload = remoteRow?.data || {};
    const payload = mergePortalState(remotePayload, localPayload);

    const { data, error } = await supabaseClient
      .from(CLOUD_STATE_TABLE)
      .upsert(
        {
          id: CLOUD_STATE_ROW_ID,
          data: payload
        },
        { onConflict: "id" }
      )
      .select("updated_at")
      .single();

    if (error) {
      console.warn("Supabase push error:", error.message);
      warnCloudOnce(error.message || CLOUD_SETUP_HINT);
      return;
    }
    cloudUpdatedAt = data?.updated_at || cloudUpdatedAt;
    hydrateLocalStorageFromCloud(payload);
  } finally {
    cloudBusy = false;
  }
}

async function pullCloudStateIfNewer() {
  if (!supabaseClient || cloudBusy) return false;
  cloudBusy = true;
  try {
    const { data, error } = await supabaseClient
      .from(CLOUD_STATE_TABLE)
      .select("updated_at, data")
      .eq("id", CLOUD_STATE_ROW_ID)
      .single();

    if (error || !data) {
      warnCloudOnce(error?.message || CLOUD_SETUP_HINT);
      return false;
    }
    const incoming = data.updated_at || "";
    if (incoming && cloudUpdatedAt && incoming <= cloudUpdatedAt) return false;
    cloudUpdatedAt = incoming;
    hydrateLocalStorageFromCloud(data.data || {});
    return true;
  } finally {
    cloudBusy = false;
  }
}

function hydrateLocalStorageFromCloud(cloudData) {
  CLOUD_SYNC_KEYS.forEach((key) => {
    const value = cloudData[key];
    if (typeof value === "undefined") return;
    if (key === STORAGE_KEYS.ticketCounter) {
      localStorage.setItem(key, String(value ?? "1"));
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  });
}

function getParsedStorageValue(key) {
  const raw = localStorage.getItem(key);
  if (raw === null || raw === undefined) {
    if (key === STORAGE_KEYS.ticketCounter) return "1";
    if (key === STORAGE_KEYS.chats) return {};
    return [];
  }

  if (key === STORAGE_KEYS.ticketCounter) return String(raw);
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function mergePortalState(remoteData, localData) {
  const merged = {};
  CLOUD_SYNC_KEYS.forEach((key) => {
    if (key === STORAGE_KEYS.ticketCounter) {
      const remoteCounter = Number(remoteData[key] || 1);
      const localCounter = Number(localData[key] || 1);
      merged[key] = String(Math.max(remoteCounter, localCounter, 1));
      return;
    }

    if (key === STORAGE_KEYS.chats) {
      merged[key] = mergeChats(remoteData[key], localData[key]);
      return;
    }

    merged[key] = mergeById(remoteData[key], localData[key]);
  });
  return merged;
}

function mergeById(remoteArr, localArr) {
  const map = new Map();
  (Array.isArray(remoteArr) ? remoteArr : []).forEach((item) => {
    if (!item || typeof item !== "object") return;
    const key = item.id || JSON.stringify(item);
    map.set(key, item);
  });

  (Array.isArray(localArr) ? localArr : []).forEach((item) => {
    if (!item || typeof item !== "object") return;
    const key = item.id || JSON.stringify(item);
    map.set(key, item);
  });

  return Array.from(map.values());
}

function mergeChats(remoteChats, localChats) {
  const remote = remoteChats && typeof remoteChats === "object" ? remoteChats : {};
  const local = localChats && typeof localChats === "object" ? localChats : {};
  const keys = new Set([...Object.keys(remote), ...Object.keys(local)]);
  const out = {};

  keys.forEach((conversationKey) => {
    out[conversationKey] = mergeById(remote[conversationKey], local[conversationKey]);
  });

  return out;
}

function warnCloudOnce(message) {
  if (cloudWarned) return;
  cloudWarned = true;
  const msg = message || CLOUD_SETUP_HINT;
  console.warn("Cloud sync warning:", msg);
  if (typeof notify === "function") {
    notify(CLOUD_SETUP_HINT, "error");
  }
}
