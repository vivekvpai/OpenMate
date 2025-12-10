const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  onReposData: (callback) => {
    const listener = (event, data) => callback(data);
    ipcRenderer.on("repos-data", listener);
    // Return a cleanup function
    return () => ipcRenderer.off("repos-data", listener);
  },
  offReposData: (listener) => {
    if (listener) {
      ipcRenderer.off("repos-data", listener);
    }
  },
  openInIDE: (data) => ipcRenderer.invoke("open-in-ide", data),
  getReposData: () => ipcRenderer.invoke("getReposData"),
  deleteRepo: (repoName) => ipcRenderer.invoke("delete-repo", repoName),
  deleteCollection: (collectionName) =>
    ipcRenderer.invoke("delete-collection", collectionName),
  addRepository: (repoData) => ipcRenderer.invoke("addRepository", repoData),
  openDirectoryDialog: () => ipcRenderer.invoke("openDirectoryDialog"),
  writeReposFile: (data) => ipcRenderer.invoke("writeReposFile", data),
});
