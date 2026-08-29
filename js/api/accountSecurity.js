const ACCOUNT_KEY = "bk_account_security_v1";
const DEVICE_ID_KEY = "bk_device_id_v1";
const MAX_DEVICES = 3;

function randomId(prefix = "bk") {
  if (globalThis.crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function getOrCreateDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = randomId("device");
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

function parseBrowser() {
  const ua = navigator.userAgent || "";
  if (/SamsungBrowser/i.test(ua)) return "Samsung Browser";
  if (/Edg\//i.test(ua)) return "Edge";
  if (/Firefox\//i.test(ua)) return "Firefox";
  if (/CriOS|Chrome\//i.test(ua)) return "Chrome";
  if (/Safari\//i.test(ua)) return "Safari";
  return "Browser";
}

function parseOs() {
  const ua = navigator.userAgent || "";
  if (/Android/i.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS/iPadOS";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Mac OS X|Macintosh/i.test(ua)) return "macOS";
  if (/Linux/i.test(ua)) return "Linux";
  return "Unbekannt";
}

export function getCurrentDeviceProfile() {
  return {
    device_id: getOrCreateDeviceId(),
    device_name: `${parseOs()} · ${parseBrowser()}`,
    browser: parseBrowser(),
    os: parseOs(),
    screen: `${window.screen?.width || 0} × ${window.screen?.height || 0}`,
    language: navigator.language || "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    created_at: new Date().toISOString(),
    last_seen_at: new Date().toISOString(),
    active: true
  };
}

export function readAccountSecurity() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "null");
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function writeAccountSecurity(data) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(data));
  return data;
}

export function registerFirstLogin(user) {
  const existing = readAccountSecurity();
  if (existing?.bandenkick_user_id) return existing;
  const device = getCurrentDeviceProfile();
  return writeAccountSecurity({
    bandenkick_user_id: Number(user.id),
    username: user.username || "Bandenkick-Spieler",
    email: user.email || "",
    email_verified: false,
    devices: [device],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
}

export function evaluateLogin(user) {
  const account = readAccountSecurity();
  const current = getCurrentDeviceProfile();
  if (!account?.bandenkick_user_id) {
    return { status: "first_login", account: registerFirstLogin(user), device: current };
  }
  if (Number(account.bandenkick_user_id) !== Number(user.id)) {
    return { status: "different_account", account, device: current };
  }
  const known = (account.devices || []).find((item) => item.device_id === current.device_id && item.active !== false);
  if (!known) return { status: "new_device", account, device: current };

  known.last_seen_at = new Date().toISOString();
  // Die Kernmerkmale dienen als Plausibilitätscheck, nicht als harter Fingerprint.
  known.device_name = current.device_name;
  known.browser = current.browser;
  known.os = current.os;
  known.screen = current.screen;
  known.language = current.language;
  known.timezone = current.timezone;
  account.username = user.username || account.username;
  account.email = user.email || account.email;
  account.updated_at = new Date().toISOString();
  writeAccountSecurity(account);
  return { status: "known_device", account, device: known };
}

export function approveCurrentDevice(user) {
  const account = readAccountSecurity() || registerFirstLogin(user);
  const current = getCurrentDeviceProfile();
  const devices = (account.devices || []).filter((item) => item.device_id !== current.device_id);
  devices.unshift(current);
  account.devices = devices.slice(0, MAX_DEVICES);
  account.username = user.username || account.username;
  account.email = user.email || account.email;
  account.updated_at = new Date().toISOString();
  return writeAccountSecurity(account);
}

export function getPrimaryDevice() {
  const account = readAccountSecurity();
  const currentId = localStorage.getItem(DEVICE_ID_KEY);
  return (account?.devices || []).find((item) => item.device_id === currentId) || account?.devices?.[0] || null;
}

export function maskEmail(email = "") {
  const [name, domain] = String(email).split("@");
  if (!name || !domain) return email || "–";
  return `${name.slice(0, 2)}***@${domain}`;
}

// TESTBRÜCKE bis die echte E-Mail-API eingebunden wird.
// Der Code wird ausschließlich bei einem bereits vorhandenen Account + neuem Gerät erzeugt.
export function createTestEmailCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
