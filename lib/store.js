const fs = require("fs");
const os = require("os");
const path = require("path");

const STORE_DIR = path.join(os.homedir(), ".openmate");
const STORE_FILE = path.join(STORE_DIR, "repos.json");

function ensureStore() {
  if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });
  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(
      STORE_FILE,
      JSON.stringify({ version: 2, repos: {}, collections: {} }, null, 2),
      { mode: 0o600 }
    );
  }
}

function loadStore() {
  ensureStore();
  try {
    const data = JSON.parse(fs.readFileSync(STORE_FILE, "utf8"));
    if (!data.repos) data.repos = {};
    if (!data.collections) data.collections = {};

    // Migrate from v1 to v2
    if (data.version === 1) {
      data.version = 2;
      data.collections = {};
      saveStore(data);
    }

    return data;
  } catch (e) {
    console.error("Error reading store. Recreating...");
    const defaultStore = { version: 2, repos: {}, collections: {} };
    fs.writeFileSync(STORE_FILE, JSON.stringify(defaultStore, null, 2), {
      mode: 0o600,
    });
    return defaultStore;
  }
}

function saveStore(store) {
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
}

module.exports = {
  loadStore,
  saveStore,
};
