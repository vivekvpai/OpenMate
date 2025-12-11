const Table = require("cli-table3");
const { loadStore, saveStore } = require("./store");
const { normalizeName, expandPath, assertDirExists } = require("./utils");
const { openItem } = require("./opener");

function cmdAdd(name, rawPath) {
  const key = normalizeName(name);
  if (!key) throw new Error("Invalid name");

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
  if (!key) throw new Error("Invalid name");

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

function displayRepositories(repoEntries) {
  if (repoEntries.length === 0) {
    console.log("No repositories found.");
    return;
  }

  console.log("Stored repos:");
  const table = new Table({
    head: ["#", "Name", "Repo Path", "Default IDE"],
    colWidths: [5, 25, 65, 15],
    style: { head: ["cyan"] },
  });

  // Sort repositories by name (case-insensitive)
  repoEntries
    .sort(([nameA], [nameB]) =>
      nameA.localeCompare(nameB, undefined, { sensitivity: "base" })
    )
    .forEach(([name, { path, ide }], index) => {
      table.push([index + 1, name, path, ide ? ide.toUpperCase() : ""]);
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

// NOTE: This modifies collections too, so it acts on the store globally.
function cmdIde(name, ideVal) {
  const validIdes = ["vs", "ws", "cs", "ij", "pc", "ag"];
  const key = normalizeName(name);
  const ide = normalizeName(ideVal);

  if (!validIdes.includes(ide)) {
    console.error(`❌ Invalid IDE. Must be one of: ${validIdes.join(", ")}`);
    process.exit(1);
  }

  const store = loadStore();
  let found = false;

  if (store.repos[key]) {
    store.repos[key].ide = ide;
    store.repos[key].updatedAt = new Date().toISOString();
    found = true;
    console.log(
      `✅ Set preferred IDE for repo "${name}" to ${ide.toUpperCase()}`
    );
  }

  if (store.collections[key]) {
    store.collections[key].ide = ide;
    store.collections[key].updatedAt = new Date().toISOString();
    found = true;
    console.log(
      `✅ Set preferred IDE for collection "${name}" to ${ide.toUpperCase()}`
    );
  }

  if (!found) {
    console.error(`❌ "${name}" not found in repos or collections.`);
    process.exit(1);
  }

  saveStore(store);
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
  openItem(name, kind, rec.path);
}

module.exports = {
  cmdAdd,
  cmdUpdate,
  cmdRemove,
  displayRepositories,
  cmdPath,
  cmdIde,
  cmdOpen,
};
