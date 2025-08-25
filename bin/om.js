#!/usr/bin/env node
/* OpenMate — om
 * Stores repo name -> path mapping and opens folders in VS Code, Windsurf, or Cursor.
 * Commands:
 *   om add <name> "<path>"
 *   om update <name> "<newPath>"
 *   om remove <name>
 *   om vs <name>
 *   om ws <name>
 *   om cs <name>
 *   om list
 *   om path <name>
 */

const fs = require("fs");
const os = require("os");
const Table = require("cli-table3");
const path = require("path");
const { spawn } = require("child_process");

const STORE_DIR = path.join(os.homedir(), ".openmate");
const STORE_FILE = path.join(STORE_DIR, "repos.json");

function ensureStore() {
  if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });
  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(
      STORE_FILE,
      JSON.stringify({ version: 1, repos: {} }, null, 2),
      { mode: 0o600 }
    );
  }
}

function loadStore() {
  ensureStore();
  try {
    const data = JSON.parse(fs.readFileSync(STORE_FILE, "utf8"));
    if (!data.repos) data.repos = {};
    return data;
  } catch (e) {
    console.error("Error reading store. Recreating...");
    fs.writeFileSync(
      STORE_FILE,
      JSON.stringify({ version: 1, repos: {} }, null, 2),
      { mode: 0o600 }
    );
    return { version: 1, repos: {} };
  }
}

function saveStore(store) {
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
}

function normalizeName(name) {
  if (!name || typeof name !== "string") return "";
  return name.trim().toLowerCase();
}

function expandPath(input) {
  if (!input || typeof input !== "string") return "";
  let p = input.replace(/^~(?=$|[\\/])/, os.homedir());
  return path.resolve(p);
}

function assertDirExists(dirPath, label = "path") {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    console.error(`Invalid ${label}: "${dirPath}" is not an existing directory.`);
    process.exit(1);
  }
}

function cmdAdd(name, rawPath) {
  const key = normalizeName(name);
  if (!key) dieUsage();

  const store = loadStore();
  if (store.repos[key]) {
    console.error(`❌ Repo name "${name}" already exists. Use \"om update ${name} \"<newPath>\"\" to change its path.`);
    process.exit(1);
  }

  const absPath = expandPath(rawPath);
  assertDirExists(absPath);

  store.repos[key] = { path: absPath, addedAt: new Date().toISOString() };
  saveStore(store);
  console.log(`✅ Added "${name}" -> ${absPath}`);
}

function cmdUpdate(name, rawPath) {
  const key = normalizeName(name);
  if (!key) dieUsage();

  const store = loadStore();
  if (!store.repos[key]) {
    console.error(`❌ Repo "${name}" is not stored. Use \"om add ${name} \"<path>\"\" first.`);
    process.exit(1);
  }

  const absPath = expandPath(rawPath);
  assertDirExists(absPath);

  store.repos[key].path = absPath;
  store.repos[key].updatedAt = new Date().toISOString();
  saveStore(store);
  console.log(`🔄 Updated "${name}" -> ${absPath}`);
}

function cmdRemove(name) {
  const key = normalizeName(name);
  const store = loadStore();
  if (!store.repos[key]) {
    console.error(`❌ Repo "${name}" not found.`);
    process.exit(1);
  }
  delete store.repos[key];
  saveStore(store);
  console.log(`🗑️  Removed "${name}".`);
}

function cmdList() {
  const { repos } = loadStore();
  const names = Object.keys(repos);

  if (!names.length) {
    console.log('No repos stored. Use: om add <name> "/path/to/repo"');
    return;
  }

  console.log("Stored repos:");

  const table = new Table({
    head: ["#", "Name", "Repo Path"],
    colWidths: [5, 25, 60],
  });

  names.sort().forEach((n, i) => {
    table.push([i + 1, n, repos[n].path]);
  });

  console.log(table.toString());
}

function cmdPath(name) {
  const key = normalizeName(name);
  const { repos } = loadStore();
  if (!repos[key]) {
    console.error(`❌ Repo "${name}" not found.`);
    process.exit(1);
  }
  console.log(repos[key].path);
}

function openVS(repoPath) {
  if (process.platform === "darwin") {
    spawn("open", ["-a", "Visual Studio Code", repoPath], { stdio: "ignore", detached: true });
  } else {
    attemptLaunch(
      [
        { cmd: "code", args: [repoPath] },
        { cmd: "code-insiders", args: [repoPath] },
      ],
      {
        onFail: () => {
          console.error("❌ Could not find VS Code CLI ('code'). Install it via VS Code settings.");
          process.exit(1);
        },
      }
    );
  }
}

function openWS(repoPath) {
  if (process.platform === "darwin") {
    spawn("open", ["-a", "Windsurf", repoPath], { stdio: "ignore", detached: true });
  } else {
    attemptLaunch([{ cmd: "windsurf", args: [repoPath] }], {
      onFail: () => {
        console.error("❌ Could not find Windsurf CLI ('windsurf').");
        process.exit(1);
      },
    });
  }
}

function openCS(repoPath) {
  if (process.platform === "darwin") {
    spawn("open", ["-a", "Cursor", repoPath], { stdio: "ignore", detached: true });
  } else {
    attemptLaunch([{ cmd: "cursor", args: [repoPath] }], {
      onFail: () => {
        console.error("❌ Could not find Cursor CLI ('cursor').");
        process.exit(1);
      },
    });
  }
}

function attemptLaunch(candidates, { onFail }) {
  if (!Array.isArray(candidates) || candidates.length === 0) return onFail();

  const tryOne = (i) => {
    if (i >= candidates.length) return onFail();
    const { cmd, args } = candidates[i];

    const child = spawn(cmd, args, {
      stdio: "ignore",
      detached: true,
      shell: true,
    });
    child.on("error", () => tryOne(i + 1));
    child.unref?.();
  };

  tryOne(0);
}

function cmdOpen(name, kind) {
  const key = normalizeName(name);
  const { repos } = loadStore();
  const rec = repos[key];
  if (!rec) {
    console.error(`❌ Repo "${name}" not found.`);
    process.exit(1);
  }
  assertDirExists(rec.path, "repo path");
  switch (kind) {
    case "vs":
      openVS(rec.path);
      console.log(`🧑‍💻  Opening "${name}" in VS Code...`);
      break;
    case "ws":
      openWS(rec.path);
      console.log(`🌊  Opening "${name}" in Windsurf...`);
      break;
    case "cs":
      openCS(rec.path);
      console.log(`🎯  Opening "${name}" in Cursor...`);
      break;
  }
}

function getVersion() {
  try {
    const pkg = require("../package.json");
    return pkg.version;
  } catch (e) {
    return "unknown";
  }
}

function dieUsage() {
  console.log(`OpenMate (om) v${getVersion()}

Usage:
  om add <name> "<path>"    Add a new repo with name and path
  om update <name> "<path>" Update an existing repo's path
  om remove <name>          Remove a stored repo
  om list                   List all stored repos
  om path <name>            Print the path of a repo
  om vs <name>              Open in VS Code
  om ws <name>              Open in Windsurf
  om cs <name>              Open in Cursor
  om --version              Show version`);
  process.exit(1);
}

(function main() {
  const [, , cmd, name, maybePath] = process.argv;

  if (process.argv.includes("--version") || process.argv.includes("-v")) {
    console.log(getVersion());
    process.exit(0);
  }

  switch ((cmd || "").toLowerCase()) {
    case "add":
      if (!name || !maybePath) dieUsage();
      return cmdAdd(name, maybePath);
    case "update":
      if (!name || !maybePath) dieUsage();
      return cmdUpdate(name, maybePath);
    case "remove":
      if (!name) dieUsage();
      return cmdRemove(name);
    case "vs":
      if (!name) dieUsage();
      return cmdOpen(name, "vs");
    case "ws":
      if (!name) dieUsage();
      return cmdOpen(name, "ws");
    case "cs":
      if (!name) dieUsage();
      return cmdOpen(name, "cs");
    case "list":
      return cmdList();
    case "path":
      if (!name) dieUsage();
      return cmdPath(name);
    default:
      return dieUsage();
  }
})();