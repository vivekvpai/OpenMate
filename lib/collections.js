const Table = require("cli-table3");
const { loadStore, saveStore } = require("./store");
const { normalizeName } = require("./utils");
const { openItem } = require("./opener");

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
    head: ["#", "Name", "Repo Path", "Default IDE"],
    colWidths: [5, 25, 65, 15],
    style: { head: ["cyan"] },
  });

  collection.repos.forEach((repoName, index) => {
    const repo = store.repos[normalizeName(repoName)];
    table.push([
      index + 1,
      repoName,
      repo ? repo.path : "❌ Repository not found",
      repo && repo.ide ? repo.ide.toUpperCase() : "",
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
    openItem(repoName, kind, repo.path);
  });
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
    head: ["#", "Name", "Repos", "Default IDE", "Repository Names"],
    colWidths: [5, 20, 10, 15, 50],
    style: { head: ["cyan"] },
    wordWrap: true,
  });

  // Sort collections by name (case-insensitive)
  collectionEntries
    .sort(([_, { name: nameA }], [__, { name: nameB }]) =>
      nameA.localeCompare(nameB, undefined, { sensitivity: "base" })
    )
    .forEach(([_, { name, repos, ide }], index) => {
      // Sort repository names within each collection
      const sortedRepos = [...repos].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
      );
      table.push([
        index + 1,
        name,
        repos.length,
        ide ? ide.toUpperCase() : "",
        sortedRepos.join(", "),
      ]);
    });

  console.log(table.toString());
}

module.exports = {
  cmdAddToCollection,
  cmdUpdateCollection,
  cmdRemoveCollection,
  findCollection,
  displayCollectionRepos,
  showCollectionNotFound,
  openCollection,
  displayCollections,
};
