const os = require("os");
const path = require("path");
const fs = require("fs");

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

function getVersion() {
  try {
    const pkg = require("../package.json");
    return pkg.version;
  } catch (e) {
    return "unknown";
  }
}

function dieUsage() {
  // This will be replaced or we can import it.
  // Actually, usage is better kept in the main bin entry or a help module.
  // For now, let's export it or let the main file handle it.
  // I will exclude dieUsage from here and handle it in bin/om.js or help.js
}

module.exports = {
  normalizeName,
  expandPath,
  assertDirExists,
  getVersion,
};
