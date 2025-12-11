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
 *   om <name> -d
 *   om <name>
 */

const { normalizeName, getVersion } = require("../lib/utils");
const { loadStore } = require("../lib/store");
const {
  cmdAdd,
  cmdUpdate,
  cmdRemove,
  displayRepositories,
  cmdPath,
  cmdIde,
  cmdOpen,
  cmdShowDefaultIde,
} = require("../lib/repos");
const {
  cmdAddToCollection,
  cmdUpdateCollection,
  cmdRemoveCollection,
  findCollection,
  displayCollectionRepos,
  showCollectionNotFound,
  openCollection,
  displayCollections,
} = require("../lib/collections");

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
    om ag <name>              Open in Antigravity IDE
    om ide <name> <ide>       Set preferred IDE (vs, ws, cs, ij, pc, ag)
    om -ide [name]            Show configured preferred IDE (Global or Repo-specific)
    om <name> -d              Open in preferred IDE (repo-specific or global default)
    om <name>                 Open in global default IDE (or local if global not set)

  Other:
    om --version              Show version`);
  process.exit(1);
}

// Logic to show suggestions if no match found
function showSuggestions(partial) {
  const store = loadStore();
  const repos = Object.keys(store.repos || {});
  const collections = Object.keys(store.collections || {});

  // Filter and sort matches
  const repoMatches = repos
    .filter((name) => name.toLowerCase().includes(partial.toLowerCase()))
    .sort();

  const collectionMatches = collections
    .filter((name) => name.toLowerCase().includes(partial.toLowerCase()))
    .sort();

  if (repoMatches.length > 0 || collectionMatches.length > 0) {
    console.log("\nSuggestions:");
    if (repoMatches.length > 0) {
      console.log("Repositories:   " + repoMatches.join("  "));
    }
    if (collectionMatches.length > 0) {
      console.log("Collections:    " + collectionMatches.join("  "));
    }
    console.log();
  }

  return { repos: repoMatches, collections: collectionMatches };
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
    case "ag": {
      if (!name) dieUsage();

      const store = loadStore();
      const key = normalizeName(name);

      // Check if exact match exists
      if (store.repos[key] || store.collections[key]) {
        if (store.collections[key]) {
          return openCollection(name, cmd.toLowerCase());
        }
        return cmdOpen(name, cmd.toLowerCase());
      }

      // No exact match, show suggestions
      console.log(`\nNo exact match for "${name}". Suggestions:`);
      showSuggestions(name);
      process.exit(1);
    }
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
    case "ide":
      if (!name || !maybePath) dieUsage();
      return cmdIde(name, maybePath);
    case "-ide":
      return cmdShowDefaultIde(name);

    default: {
      const store = loadStore();
      const key = normalizeName(cmd);
      const repo = store.repos[key];
      const collection = store.collections[key];

      // Check for -d flag
      const useLocalPreference = args[1] === "-d";

      if (repo || collection) {
        let preferredIde;
        if (useLocalPreference) {
          // Prioritize Local Preference -> Global Default
          preferredIde =
            (repo ? repo.ide : collection.ide) || store.ide_default;
        } else {
          // Prioritize Global Default -> Local Preference
          preferredIde =
            store.ide_default || (repo ? repo.ide : collection.ide);
        }

        if (preferredIde) {
          if (collection) {
            return openCollection(cmd, preferredIde);
          }
          return cmdOpen(cmd, preferredIde);
        }

        console.log(
          `ℹ️  "${cmd}" is a valid ${
            repo ? "repo" : "collection"
          }, but no preferred IDE is set.`
        );
        console.log(`   To set one: om ide ${cmd} <vs|ws|cs|ij|pc|ag>`);
        console.log(`   Or use explicit command: om vs ${cmd}`);
        process.exit(1);
      }

      return dieUsage();
    }
  }
})();
