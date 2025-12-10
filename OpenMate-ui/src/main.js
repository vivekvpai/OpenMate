const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const os = require("os");
const fs = require("fs");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const readReposFile = () => {
  const STORE_DIR = path.join(os.homedir(), ".openmate");
  const STORE_FILE = path.join(STORE_DIR, "repos.json");

  // Default structure for the repos file
  const defaultReposData = {
    version: 2,
    repos: {},
    collections: {},
  };

  try {
    // Create .openmate directory if it doesn't exist
    if (!fs.existsSync(STORE_DIR)) {
      fs.mkdirSync(STORE_DIR, { recursive: true });
    }

    // Create default repos.json if it doesn't exist
    if (!fs.existsSync(STORE_FILE)) {
      fs.writeFileSync(
        STORE_FILE,
        JSON.stringify(defaultReposData, null, 2),
        "utf8"
      );
      return defaultReposData;
    }

    // Read and return existing data
    const data = fs.readFileSync(STORE_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading repos.json:", error);
    return null;
  }
};

// Function to open a path using openmate cli
function openIDE(name, ide, ideName, path) {
  return new Promise((resolve, reject) => {
    const { exec } = require("child_process");
    exec(`om ${ide} "${name}"`, (error) => {
      if (error) {
        reject(
          new Error(`Failed to open ${name} in ${ideName}: ${error.message}`)
        );
      } else {
        resolve();
      }
    });
  });
}

// Helper function to write repos data to file
const writeReposFile = (data) => {
  const STORE_DIR = path.join(os.homedir(), ".openmate");
  const STORE_FILE = path.join(STORE_DIR, "repos.json");

  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing repos.json:", error);
    return false;
  }
};

// Expose writeReposFile to renderer
ipcMain.handle("writeReposFile", async (event, data) => {
  return writeReposFile(data);
});

// Expose repos data to renderer
ipcMain.handle("getReposData", async () => {
  return readReposFile();
});

const createWindow = () => {
  // Set up IPC handler for opening in IDE
  ipcMain.handle("open-in-ide", async (event, { name, path, ide }) => {
    try {
      switch (ide) {
        case "vs":
          await openIDE(name, "vs", "VS Code", path);
          break;
        case "ws":
          await openIDE(name, "ws", "Windsurf", path);
          break;
        case "cs":
          await openIDE(name, "cs", "Cursor", path);
          break;
        case "ij":
          await openIDE(name, "ij", "IntelliJ", path);
          break;
        case "pc":
          await openIDE(name, "pc", "PyCharm", path);
          break;
        case "ag":
          await openIDE(name, "ag", "Antigravity", path);
          break;
        default:
          await openIDE(name, "default", "Default", path);
      }
      return { success: true };
    } catch (error) {
      console.error(`Error opening ${path} in ${ide}:`, error);
      return { success: false, error: error.message };
    }
  });

  // Create the browser window.
  // Get the absolute path to the icon
  // const iconPath = path.join(app.getAppPath(), 'src/assets/logo.png');

  let iconPath;
  if (process.platform === "win32") {
    iconPath = path.join(app.getAppPath(), "assets/logo.ico");
  } else if (process.platform === "darwin") {
    iconPath = path.join(app.getAppPath(), "assets/logo.icns");
  } else {
    iconPath = path.join(app.getAppPath(), "assets/logo.png");
  }

  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: iconPath,
    frame: true, // Remove the default menu bar and frame
    autoHideMenuBar: true, // Hide the menu bar
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Read and send repos data to renderer
  const reposData = readReposFile();
  if (reposData) {
    mainWindow.webContents.on("did-finish-load", () => {
      mainWindow.webContents.send("repos-data", {
        repos: Object.entries(reposData.repos || {}).map(([name, data]) => ({
          name,
          path: data.path,
          updatedAt: data.updatedAt,
        })),
        collections: Object.entries(reposData.collections || {}).map(
          ([name, data]) => ({
            name,
            repos: data.repos.join(", "),
            updatedAt: data.updatedAt,
          })
        ),
        ide_default_1: reposData.ide_default_1 || "",
        ide_default_2: reposData.ide_default_2 || "",
      });
    });
  }

  // Open DevTools in development
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
};

// Handle repository deletion
ipcMain.handle("delete-repo", async (event, repoName) => {
  try {
    const data = readReposFile();
    if (data && data.repos && data.repos[repoName]) {
      delete data.repos[repoName];
      if (writeReposFile(data)) {
        // Notify all windows about the update
        BrowserWindow.getAllWindows().forEach((window) => {
          window.webContents.send("repos-data", {
            repos: Object.entries(data.repos || {}).map(([name, repo]) => ({
              name,
              path: repo.path,
              updatedAt: repo.updatedAt,
            })),
            collections: Object.entries(data.collections || {}).map(
              ([name, collection]) => ({
                name,
                repos: collection.repos.join(", "),
                updatedAt: collection.updatedAt,
              })
            ),
            ide_default_1: data.ide_default_1 || "",
            ide_default_2: data.ide_default_2 || "",
          });
        });
        return { success: true };
      }
    }
    return {
      success: false,
      error: "Repository not found or could not be deleted",
    };
  } catch (error) {
    console.error("Error deleting repository:", error);
    return { success: false, error: error.message };
  }
});

// Helper function to delete a collection
const deleteCollection = (collectionName) => {
  try {
    // Read current data
    const data = readReposFile();

    if (!data) {
      console.error("❌ Failed to read repos file or file is empty");
      return { success: false, error: "Failed to read repositories data" };
    }

    if (!data.collections) {
      console.error("❌ No collections object found in data");
      return { success: false, error: "No collections data found" };
    }

    // Check if collection exists
    if (!data.collections[collectionName]) {
      console.error(`❌ Collection not found: ${collectionName}`);
      return { success: false, error: "Collection not found" };
    }

    // Delete the collection
    delete data.collections[collectionName];

    // Write changes to file
    if (!writeReposFile(data)) {
      console.error("❌ Failed to write to repos.json");
      return { success: false, error: "Failed to save changes" };
    }

    // Get updated data
    const updatedData = readReposFile();

    if (!updatedData) {
      console.error("❌ Failed to read updated data");
      return { success: false, error: "Failed to verify deletion" };
    }

    // Prepare data for renderer
    const responseData = {
      repos: Object.entries(updatedData.repos || {}).map(([name, repo]) => ({
        name,
        path: repo.path,
        updatedAt: repo.updatedAt,
      })),
      collections: Object.entries(updatedData.collections || {}).map(
        ([name, collection]) => ({
          name,
          repos: Array.isArray(collection.repos)
            ? collection.repos.join(", ")
            : collection.repos,
          updatedAt: collection.updatedAt,
        })
      ),
      ide_default_1: updatedData.ide_default_1 || "",
      ide_default_2: updatedData.ide_default_2 || "",
    };

    // Notify all windows
    const windows = BrowserWindow.getAllWindows();

    windows.forEach((window, index) => {
      window.webContents.send("repos-data", responseData);
    });

    return { success: true };
  } catch (error) {
    console.error("❌ ERROR in deleteCollection:", error);
    console.error("Stack trace:", error.stack);
    return { success: false, error: error.message };
  }
};

// Handle collection deletion via IPC
ipcMain.handle("delete-collection", async (event, collectionName) => {
  return deleteCollection(collectionName);
});

// Handle adding a new repository
ipcMain.handle("addRepository", async (event, { name, path }) => {
  try {
    const data = readReposFile();

    // Check if repo with this name already exists
    if (data.repos[name]) {
      throw new Error("A repository with this name already exists");
    }

    // Add the new repository
    data.repos[name] = {
      path: path,
      updatedAt: new Date().toISOString(),
    };

    // Save the updated data
    await writeReposFile(data);
    return { success: true };
  } catch (error) {
    console.error("Error adding repository:", error);
    throw error;
  }
});

// Handle opening directory dialog
ipcMain.handle("openDirectoryDialog", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
    title: "Select Repository Directory",
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
