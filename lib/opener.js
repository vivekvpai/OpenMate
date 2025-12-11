const { spawn } = require("child_process");
const path = require("path");

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
  const isWindows = process.platform === "win32";
  const intellijPaths = [];

  if (isWindows) {
    intellijPaths.push({
      cmd: "idea64.exe",
      args: [repoPath],
      paths: [
        path.join(
          process.env.LOCALAPPDATA,
          "JetBrains",
          "IntelliJ*",
          "bin",
          "idea64.exe"
        ),
        path.join(
          process.env.PROGRAMFILES,
          "JetBrains",
          "IntelliJ*",
          "bin",
          "idea64.exe"
        ),
      ],
    });
  } else {
    // macOS paths
    intellijPaths.push(
      { cmd: "open", args: ["-a", "IntelliJ IDEA", repoPath] },
      { cmd: "open", args: ["-a", "IntelliJ IDEA CE", repoPath] },
      { cmd: "open", args: ["-a", "IntelliJ IDEA Ultimate", repoPath] },
      { cmd: "idea", args: [repoPath] }
    );
  }

  // Common paths
  intellijPaths.push(
    { cmd: "idea", args: [repoPath] },
    { cmd: "intellij", args: [repoPath] }
  );

  attemptLaunch(intellijPaths, {
    onFail: () =>
      console.error(
        "❌ IntelliJ IDEA not found. Make sure it's installed and in your PATH."
      ),
  });
}

function openPC(repoPath) {
  const isWindows = process.platform === "win32";
  const pycharmPaths = [];

  if (isWindows) {
    pycharmPaths.push({
      cmd: "pycharm64.exe",
      args: [repoPath],
      paths: [
        path.join(
          process.env.LOCALAPPDATA,
          "Programs",
          "PyCharm*",
          "bin",
          "pycharm64.exe"
        ),
        path.join(
          process.env.PROGRAMFILES,
          "JetBrains",
          "PyCharm*",
          "bin",
          "pycharm64.exe"
        ),
      ],
    });
  } else {
    // macOS paths
    pycharmPaths.push(
      { cmd: "open", args: ["-a", "PyCharm", repoPath] },
      { cmd: "open", args: ["-a", "PyCharm CE", repoPath] },
      { cmd: "open", args: ["-a", "PyCharm Professional", repoPath] },
      { cmd: "pycharm", args: [repoPath] }
    );
  }

  // Common paths
  pycharmPaths.push(
    { cmd: "pycharm", args: [repoPath] },
    { cmd: "pycharm-professional", args: [repoPath] },
    { cmd: "pycharm-community", args: [repoPath] }
  );

  attemptLaunch(pycharmPaths, {
    onFail: () =>
      console.error(
        "❌ PyCharm not found. Make sure it's installed and in your PATH."
      ),
  });
}

function openAG(repoPath) {
  if (process.platform === "darwin") {
    spawn("open", ["-a", "Antigravity", repoPath], {
      stdio: "ignore",
      detached: true,
    });
  } else {
    attemptLaunch([{ cmd: "antigravity", args: [repoPath] }], {
      onFail: () => console.error("❌ Antigravity IDE not found."),
    });
  }
}

function openItem(name, ideVal, path) {
  console.log(`Open ${name} in ${ideVal} at ${path}`);
  switch (ideVal) {
    case "vs":
      openVS(path);
      console.log(`🧑‍💻  Opening "${name}" in VS Code...`);
      break;
    case "ws":
      openWS(path);
      console.log(`🌊  Opening "${name}" in Windsurf...`);
      break;
    case "cs":
      openCS(path);
      console.log(`🎯  Opening "${name}" in Cursor...`);
      break;
    case "ij":
      openIJ(path);
      console.log(`💡  Opening "${name}" in IntelliJ IDEA...`);
      break;
    case "pc":
      openPC(path);
      console.log(`🐍  Opening "${name}" in PyCharm...`);
      break;
    case "ag":
      openAG(path);
      console.log(`🚀  Opening "${name}" in Antigravity IDE...`);
      break;
    default:
      console.error(`❌ Unknown IDE: ${ideVal}`);
      process.exit(1);
  }
}

module.exports = {
  openVS,
  openWS,
  openCS,
  openIJ,
  openPC,
  openAG,
  openItem,
};
