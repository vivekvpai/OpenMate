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
 *   om init <name>
 */

const fs = require("fs");
const os = require("os");
const Table = require("cli-table3");
const path = require("path");
const { spawn } = require("child_process");

const STORE_DIR = path.join(os.homedir(), ".openmate");
const STORE_FILE = path.join(STORE_DIR, "repos.json");

// other helper functions
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
    console.error(
      `Invalid ${label}: "${dirPath}" is not an existing directory.`
    );
    process.exit(1);
  }
}

function dieUsage() {
  console.log(`OpenMate (om) v${getVersion()}

Usage:
  Repo Management:
    om add <name> "<path>"       Add a new repo with name and path
    om update <name> "<path>"    Update an existing repo's path
    om remove <name>             Remove a stored repo
    om init <name>               Add current directory as a repository
    om list [-r|-c]              List all repositories (-r: only repos, -c: only collections)
    om path <name>               Print the path of a repo

  Collection Management:
    om add -c <name> "<repo1,repo2,...>"    Add/update a collection
    om update -c <name> "<repo1,repo2,...>" Update a collection's repos
    om remove -c <name>                   Remove a collection
    om list -c               List only collections
    om list                  List both repositories and collections

  Open Repos/Collections:
    om vs <name>              Open in VS Code
    om ws <name>              Open in Windsurf
    om cs <name>              Open in Cursor
    om ij <name>              Open in IntelliJ IDEA
    om pc <name>              Open in PyCharm

  Other:
    om --version              Show version`);
  process.exit(1);
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
    case "ij":
      openIJ(rec.path);
      console.log(`💡  Opening "${name}" in IntelliJ IDEA...`);
      break;
    case "pc":
      openPC(rec.path);
      console.log(`🐍  Opening "${name}" in PyCharm...`);
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

// Repo management functions
function cmdAdd(name, rawPath) {
  const key = normalizeName(name);
  if (!key) dieUsage();

  const store = loadStore();
  if (store.repos[key]) {
    console.error(
      `❌ Repo name "${name}" already exists. Use \"om update ${name} \"<newPath>\"\" to change its path.`
    );
    process.exit(1);
  }

  const absPath = expandPath(rawPath);
  assertDirExists(absPath);

  store.repos[key] = { path: absPath, updatedAt: new Date().toISOString() };
  saveStore(store);
  console.log(`✅ Added "${name}" -> ${absPath}`);
}

function cmdUpdate(name, rawPath) {
  const key = normalizeName(name);
  if (!key) dieUsage();

  const store = loadStore();
  if (!store.repos[key]) {
    console.error(
      `❌ Repo "${name}" is not stored. Use \"om add ${name} \"<path>\"\" first.`
    );
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

function cmdList(showRepos = true, showCollections = true) {
  const store = loadStore();
  const { repos, collections } = store;
  const repoEntries = Object.entries(repos);
  const collectionEntries = Object.entries(collections);

  // Display repositories if requested
  if (showRepos) {
    displayRepositories(repoEntries);
    if (showCollections && repoEntries.length > 0) {
      console.log(); // Add spacing between sections
    }
  }

  // Display collections if requested
  if (showCollections) {
    displayCollections(collectionEntries, showRepos);
  }
}

// Collection management functions
function cmdAddToCollection(collectionName, repoList) {
  const store = loadStore();
  const collectionKey = normalizeName(collectionName);
  const repos = repoList.split(",").map((r) => normalizeName(r.trim()));

  // Verify all repos exist
  const missingRepos = repos.filter((r) => !store.repos[r]);
  if (missingRepos.length > 0) {
    console.error(
      `❌ The following repos do not exist: ${missingRepos.join(", ")}`
    );
    process.exit(1);
  }

  store.collections[collectionKey] = {
    name: collectionName,
    repos: [...new Set(repos)], // Remove duplicates
    updatedAt: new Date().toISOString(),
  };

  saveStore(store);
  console.log(
    `✅ Added ${repos.length} repos to collection "${collectionName}"`
  );
}

function cmdUpdateCollection(collectionName, repoList) {
  const store = loadStore();
  const collectionKey = normalizeName(collectionName);

  if (!store.collections[collectionKey]) {
    console.error(`❌ Collection "${collectionName}" does not exist.`);
    process.exit(1);
  }

  return cmdAddToCollection(collectionName, repoList);
}

function cmdRemoveCollection(collectionName) {
  const store = loadStore();
  const collectionKey = normalizeName(collectionName);

  if (!store.collections[collectionKey]) {
    console.error(`❌ Collection "${collectionName}" does not exist.`);
    process.exit(1);
  }

  delete store.collections[collectionKey];
  saveStore(store);
  console.log(`✅ Removed collection "${collectionName}"`);
}

function findCollection(store, collectionName) {
  const normalizedTarget = normalizeName(collectionName);
  const collectionKey = Object.keys(store.collections).find(
    (key) => normalizeName(key) === normalizedTarget
  );
  return collectionKey
    ? { ...store.collections[collectionKey], key: collectionKey }
    : null;
}

function displayCollectionRepos(collection, store) {
  console.log(
    `\nCollection: ${collection.name} (${collection.repos.length} repos)\n`
  );

  const table = new Table({
    head: ["#", "Name", "Repo Path"],
    colWidths: [5, 25, 80],
    style: { head: ["cyan"] },
  });

  collection.repos.forEach((repoName, index) => {
    const repo = store.repos[normalizeName(repoName)];
    table.push([
      index + 1,
      repoName,
      repo ? repo.path : "❌ Repository not found",
    ]);
  });

  console.log(table.toString());
}

function showCollectionNotFound(collectionName, collections) {
  console.error(`❌ Collection "${collectionName}" not found.`);
  const collectionEntries = Object.entries(collections);

  if (collectionEntries.length === 0) {
    console.log("No collections available.");
    return;
  }

  console.log("\nAvailable collections:");
  collectionEntries
    .sort(([_, a], [__, b]) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    )
    .forEach(([_, { name }], index) => {
      console.log(`  ${index + 1}. ${name}`);
    });
}

function openCollection(collectionName, kind) {
  const store = loadStore();
  const collectionKey = normalizeName(collectionName);
  const collection = store.collections[collectionKey];

  if (!collection) {
    console.error(`❌ Collection "${collectionName}" not found.`);
    process.exit(1);
  }

  console.log(
    `Opening collection "${collection.name}" (${collection.repos.length} repos)`
  );

  // Open each repo in the collection
  collection.repos.forEach((repoName) => {
    const repo = store.repos[repoName];
    if (!repo) {
      console.error(`❌ Repo "${repoName}" not found in collection.`);
      return;
    }

    console.log(`  - ${repoName} (${repo.path})`);
    switch (kind) {
      case "vs":
        openVS(repo.path);
        break;
      case "ws":
        openWS(repo.path);
        break;
      case "cs":
        openCS(repo.path);
        break;
      case "ij":
        openIJ(repo.path);
        break;
      case "pc":
        openPC(repo.path);
        break;
    }
  });
}

function displayRepositories(repoEntries) {
  if (repoEntries.length === 0) {
    console.log("No repositories found.");
    return;
  }

  console.log("Stored repos:");
  const table = new Table({
    head: ["#", "Name", "Repo Path"],
    colWidths: [5, 25, 80],
    style: { head: ["cyan"] },
  });

  // Sort repositories by name (case-insensitive)
  repoEntries
    .sort(([nameA], [nameB]) =>
      nameA.localeCompare(nameB, undefined, { sensitivity: "base" })
    )
    .forEach(([name, { path }], index) => {
      table.push([index + 1, name, path]);
    });

  console.log(table.toString());
}

function displayCollections(collectionEntries, showRepos) {
  if (collectionEntries.length === 0) {
    console.log(
      showRepos
        ? "No collections found."
        : "No collections found. Use 'om list -r' to see repositories."
    );
    return;
  }

  console.log(showRepos ? "Collections:" : "Stored collections:");

  const table = new Table({
    head: ["#", "Name", "Repos", "Repository Names"],
    colWidths: [5, 20, 10, 50],
    style: { head: ["cyan"] },
    wordWrap: true,
  });

  // Sort collections by name (case-insensitive)
  collectionEntries
    .sort(([_, { name: nameA }], [__, { name: nameB }]) =>
      nameA.localeCompare(nameB, undefined, { sensitivity: "base" })
    )
    .forEach(([_, { name, repos }], index) => {
      // Sort repository names within each collection
      const sortedRepos = [...repos].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
      );
      table.push([index + 1, name, repos.length, sortedRepos.join(", ")]);
    });

  console.log(table.toString());
}

// Open repo function
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
    spawn("open", ["-a", "Visual Studio Code", repoPath], {
      stdio: "ignore",
      detached: true,
    });
  } else {
    attemptLaunch(
      [
        { cmd: "code", args: [repoPath] },
        { cmd: "code-insiders", args: [repoPath] },
      ],
      {
        onFail: () => {
          console.error(
            "❌ Could not find VS Code CLI ('code'). Install it via VS Code settings."
          );
          process.exit(1);
        },
      }
    );
  }
}

function openWS(repoPath) {
  if (process.platform === "darwin") {
    spawn("open", ["-a", "Windsurf", repoPath], {
      stdio: "ignore",
      detached: true,
    });
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
    spawn("open", ["-a", "Cursor", repoPath], {
      stdio: "ignore",
      detached: true,
    });
  } else {
    attemptLaunch([{ cmd: "cursor", args: [repoPath] }], {
      onFail: () => console.error("❌ Cursor CLI not found."),
    });
  }
}

function openIJ(repoPath) {
  const isWindows = process.platform === 'win32';
  const intellijPaths = [];

  if (isWindows) {
    intellijPaths.push(
      { cmd: "idea64.exe", args: [repoPath], paths: [
        path.join(process.env.LOCALAPPDATA, "JetBrains", "IntelliJ*", "bin", "idea64.exe"),
        path.join(process.env.PROGRAMFILES, "JetBrains", "IntelliJ*", "bin", "idea64.exe")
      ]}
    );
  } else {
    // macOS paths
    intellijPaths.push(
      { cmd: 'open', args: ['-a', 'IntelliJ IDEA', repoPath] },
      { cmd: 'open', args: ['-a', 'IntelliJ IDEA CE', repoPath] },
      { cmd: 'open', args: ['-a', 'IntelliJ IDEA Ultimate', repoPath] },
      { cmd: 'idea', args: [repoPath] }
    );
  }
  
  // Common paths
  intellijPaths.push(
    { cmd: 'idea', args: [repoPath] },
    { cmd: 'intellij', args: [repoPath] }
  );
  
  attemptLaunch(intellijPaths, {
    onFail: () => console.error("❌ IntelliJ IDEA not found. Make sure it's installed and in your PATH."),
  });
}

function openPC(repoPath) {
  const isWindows = process.platform === 'win32';
  const pycharmPaths = [];

  if (isWindows) {
    pycharmPaths.push(
      { cmd: "pycharm64.exe", args: [repoPath], paths: [
        path.join(process.env.LOCALAPPDATA, "Programs", "PyCharm*", "bin", "pycharm64.exe"),
        path.join(process.env.PROGRAMFILES, "JetBrains", "PyCharm*", "bin", "pycharm64.exe")
      ]}
    );
  } else {
    // macOS paths
    pycharmPaths.push(
      { cmd: 'open', args: ['-a', 'PyCharm', repoPath] },
      { cmd: 'open', args: ['-a', 'PyCharm CE', repoPath] },
      { cmd: 'open', args: ['-a', 'PyCharm Professional', repoPath] },
      { cmd: 'pycharm', args: [repoPath] }
    );
  }
  
  // Common paths
  pycharmPaths.push(
    { cmd: 'pycharm', args: [repoPath] },
    { cmd: 'pycharm-professional', args: [repoPath] },
    { cmd: 'pycharm-community', args: [repoPath] }
  );
  
  attemptLaunch(pycharmPaths, {
    onFail: () => console.error("❌ PyCharm not found. Make sure it's installed and in your PATH."),
  });
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

// Main function
(function main() {
  const args = process.argv.slice(2);

  if (args.includes("--version") || args.includes("-v")) {
    console.log(getVersion());
    process.exit(0);
  }

  const cmd = args[0];
  const isCollectionCmd = args[1] === "-c";

  // Handle collection commands
  if (isCollectionCmd) {
    const subCmd = cmd;
    const name = args[2];
    const value = args[3];

    switch (subCmd) {
      case "add":
        if (!name || !value) dieUsage();
        return cmdAddToCollection(name, value);
      case "update":
        if (!name || !value) dieUsage();
        return cmdUpdateCollection(name, value);
      case "remove":
        if (!name) dieUsage();
        return cmdRemoveCollection(name);
      case "list":
        return cmdList(false, true);
      default:
        return dieUsage();
    }
  }

  // Handle regular commands
  const name = args[1];
  const maybePath = args[2];

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
    case "ws":
    case "cs":
    case "ij":
    case "pc":
      if (!name) dieUsage();
      // Check if it's a collection
      const store = loadStore();
      if (store.collections[normalizeName(name)]) {
        return openCollection(name, cmd.toLowerCase());
      }
      return cmdOpen(name, cmd.toLowerCase());
    case "init":
      if (!name) dieUsage();
      return cmdAdd(name, process.cwd());
    case "list": {
      const showOnlyRepos = args.includes("-r");
      const showOnlyCollections = args.includes("-c");
      const nonFlagArgs = args.slice(1).filter((arg) => !arg.startsWith("-"));

      // Handle collection listing if a collection name is provided
      if (nonFlagArgs.length > 0 && !showOnlyRepos && !showOnlyCollections) {
        const collectionName = nonFlagArgs[0];
        const store = loadStore();
        const collection = findCollection(store, collectionName);

        if (collection) {
          displayCollectionRepos(collection, store);
          return;
        } else {
          showCollectionNotFound(collectionName, store.collections);
          process.exit(1);
        }
      }

      return cmdList(!showOnlyCollections, !showOnlyRepos);
    }
    case "path":
      if (!name) dieUsage();
      return cmdPath(name);
    default:
      return dieUsage();
  }
})();
