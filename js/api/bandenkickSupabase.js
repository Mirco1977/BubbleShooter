const BANDENKICK_USER_URL = window.location.hostname.endsWith("bandenkick.de")
  ? "/api/v1/user/logged-in"
  : "https://bandenkick.de/api/v1/user/logged-in";
const SUPABASE_FUNCTIONS_URL = "https://mvlxkwsdqxinwfkxxbgp.supabase.co/functions/v1";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_gAyM09EEq5TgdkUcxdYaJw_q1TINDYi";
let userPromise = null;
let syncedUser = null;
const PENDING_LEVELS_KEY = "bk_supabase_pending_levels_v1";
const EXTERNAL_TEST_USER = {
  "logged-in": true,
  user: {
    id: 101,
    username: "Mirco Djerdak",
    email: "djerdakmirco@web.de",
    teams: {
      clubs: {
        id: 386,
        name: "Stuttgarter Kickers E-Sports",
        short: "SKW",
        crest: "team/crest/1740231710.png"
      },
      oneone: null
    }
  }
};
const USE_EXTERNAL_TEST_USER = !window.location.hostname.endsWith("bandenkick.de");
async function readJson(response) {
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!response.ok) throw new Error(data?.error || data?.message || `HTTP ${response.status}`);
  return data;
}
async function callEdgeFunction(name, body) {
  const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}` },
    body: JSON.stringify(body)
  });
  return readJson(response);
}
export async function getBandenkickUser({ force = false } = {}) {
  if (!force && userPromise) return userPromise;
  userPromise = (async () => {
    if (USE_EXTERNAL_TEST_USER) {
      // GitHub-Pages-Testbetrieb: bis der Login-Handshake/API-Endpunkt vorliegt,
      // verwenden wir ausschließlich den vereinbarten Testaccount.
      return structuredClone(EXTERNAL_TEST_USER);
    }
    const response = await fetch(BANDENKICK_USER_URL, { method: "GET", credentials: "include", headers: { Accept: "application/json" } });
    const data = await readJson(response);
    if (data?.["logged-in"] !== true || !data?.user?.id) return null;
    return data;
  })().catch((error) => { userPromise = null; throw error; });
  return userPromise;
}
export async function syncBandenkickUser({ force = false } = {}) {
  if (syncedUser && !force) return syncedUser;
  const session = await getBandenkickUser({ force });
  if (!session) return null;
  const result = await callEdgeFunction("sync-bandenkick-user", session);
  if (!result?.success) throw new Error(result?.error || "Benutzersynchronisierung fehlgeschlagen");
  syncedUser = { session, result };
  return syncedUser;
}
function readPendingLevels() {
  try {
    const value = JSON.parse(localStorage.getItem(PENDING_LEVELS_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}
function writePendingLevels(items) {
  localStorage.setItem(PENDING_LEVELS_KEY, JSON.stringify(items));
}
function queueLevelResult(payload) {
  const items = readPendingLevels();
  const key = `${payload.bandenkick_user_id}:${payload.level}`;
  const index = items.findIndex((item) => `${item.bandenkick_user_id}:${item.level}` === key);
  if (index >= 0) items[index] = payload; else items.push(payload);
  writePendingLevels(items);
}
async function resolveBandenkickUserId() {
  const cached = Number(syncedUser?.session?.user?.id);
  if (cached) return cached;
  const synced = await syncBandenkickUser();
  return Number(synced?.session?.user?.id) || 0;
}
export async function flushPendingLevelResults() {
  const userId = await resolveBandenkickUserId();
  if (!userId) return { success: false, skipped: true, reason: "not_logged_in" };
  const items = readPendingLevels();
  const remaining = [];
  let saved = 0;
  for (const item of items) {
    if (Number(item.bandenkick_user_id) !== userId) { remaining.push(item); continue; }
    try {
      const result = await callEdgeFunction("save-level", item);
      if (result?.success) saved++; else remaining.push(item);
    } catch (error) {
      console.warn("Ausstehendes Level konnte nicht synchronisiert werden:", item.level, error);
      remaining.push(item);
    }
  }
  writePendingLevels(remaining);
  return { success: remaining.length === 0, saved, remaining: remaining.length };
}
export async function saveLevelResult({ level, score, stars, completed = true }) {
  const bandenkickUserId = await resolveBandenkickUserId();
  if (!bandenkickUserId) return { success: false, skipped: true, reason: "not_logged_in" };
  const payload = {
    bandenkick_user_id: bandenkickUserId,
    level: Math.max(1, Math.floor(Number(level) || 1)),
    score: Math.max(0, Math.floor(Number(score) || 0)),
    stars: Math.max(0, Math.min(3, Math.floor(Number(stars) || 0))),
    completed: completed === true
  };
  // Zuerst lokal vormerken. Erst nach bestaetigtem 200/success aus der Queue entfernen.
  queueLevelResult(payload);
  const result = await callEdgeFunction("save-level", payload);
  if (!result?.success) throw new Error(result?.error || "Levelspeicherung fehlgeschlagen");
  const remaining = readPendingLevels().filter((item) =>
    !(Number(item.bandenkick_user_id) === bandenkickUserId && Number(item.level) === payload.level)
  );
  writePendingLevels(remaining);
  return result;
}
export async function getRanking() {
  // Für die TOP-10 braucht der Ranking-Endpunkt keinen Login.
  // Ist der Benutzer bereits synchronisiert, senden wir seine Bandenkick-ID
  // mit, damit zusätzlich sein persönliches Rankingfenster geliefert wird.
  const bandenkickUserId = Number(syncedUser?.session?.user?.id) || 0;
  return callEdgeFunction("get-ranking", {
    bandenkick_user_id: bandenkickUserId || null
  });
}

export function redirectToBandenkickLogin() {
  const currentUrl = window.location.href;
  const loginUrl = `https://bandenkick.de/esport/auth/login?redirect=${encodeURIComponent(currentUrl)}`;
  window.location.href = loginUrl;
}

export function getSyncedBandenkickUser() { return syncedUser; }
