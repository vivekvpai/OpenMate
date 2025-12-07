// =======================
// State Management
// =======================
const AppState = {
  repos: [],
  collections: [],

  // Available IDE Options
  IDE_OPTIONS: [
    { value: "", label: "Default" },
    { value: "ag", label: "Antigravity" },
    { value: "cs", label: "Cursor" },
    { value: "ws", label: "Windsurf" },
    { value: "vs", label: "VS Code" },
    { value: "ij", label: "IntelliJ" },
    { value: "pc", label: "PyCharm" },
  ],

  setRepos(repos) {
    this.repos = repos;
  },

  setCollections(collections) {
    this.collections = collections;
  },

  getFilteredRepos(searchTerm) {
    return this.filterItems(this.repos, searchTerm);
  },

  getFilteredCollections(searchTerm) {
    return this.filterItems(this.collections, searchTerm);
  },

  filterItems(items, searchTerm) {
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        (item.path && item.path.toLowerCase().includes(term)) ||
        (item.repos && item.repos.toLowerCase().includes(term))
    );
  },
};

// =======================
// Utility Functions
// =======================
const Utils = {
  formatPath(path) {
    return path ? path.replace(/\\/g, "/") : "";
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "className") {
        element.className = value;
      } else {
        element.setAttribute(key, value);
      }
    });
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
    return element;
  },
};

// =======================
// Storage Management
// =======================
const Storage = {
  THEME_KEY: "openmate-theme",
  IDE_KEY: "openmate-ide-selector",

  get(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("Storage get failed:", e);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("Storage set failed:", e);
    }
  },
};

// =======================
// Theme Management
// =======================
const ThemeManager = {
  init() {
    this.themeToggle = document.getElementById("theme-toggle");
    this.themeIcon = document.querySelector(".theme-icon");

    this.loadTheme();
    this.bindEvents();
  },

  loadTheme() {
    const savedTheme = Storage.get(Storage.THEME_KEY);
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const theme = savedTheme || (systemPrefersDark ? "dark" : "light");

    this.setTheme(theme);
  },

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
    Storage.set(Storage.THEME_KEY, theme);
  },

  toggle() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    this.setTheme(newTheme);
  },

  bindEvents() {
    this.themeToggle.addEventListener("click", () => this.toggle());
  },
};

// =======================
// IDE Selector Management
// =======================
const IDEManager = {
  // Store per-item preferences in memory
  // Key: "${type}:${name}" (e.g., "repo:MyRepo" or "collection:MyCol")
  // Value: ide code (e.g., "cs", "vs")
  itemPreferences: new Map(),

  init() {
    this.selector = document.getElementById("ide-selector");

    // Populate global selector options
    const optionsHtml = AppState.IDE_OPTIONS.map((opt) => {
      // For global selector, use "Select Default IDE" or similar for the empty option
      const label = opt.value === "" ? "Select Default IDE" : opt.label;
      const disabled = opt.value === "" ? "disabled" : "";
      return `<option value="${opt.value}" ${disabled}>${label}</option>`;
    }).join("");
    this.selector.innerHTML = optionsHtml;

    this.loadPreference();
    this.bindEvents();
  },

  loadPreference() {
    const savedIDE = Storage.get(Storage.IDE_KEY);
    if (savedIDE) {
      this.selector.value = savedIDE;
    }
  },

  getSelectedIDE() {
    return this.selector.value;
  },

  async setItemIDE(type, name, ide) {
    if (!ide) {
      this.itemPreferences.delete(`${type}:${name}`);
    } else {
      this.itemPreferences.set(`${type}:${name}`, ide);
    }

    try {
      const data = await window.electronAPI.getReposData();
      const section = type === "repo" ? "repos" : "collections";

      if (data[section] && data[section][name]) {
        if (ide) {
          data[section][name].ide = ide;
        } else {
          delete data[section][name].ide;
        }

        await window.electronAPI.writeReposFile(data);
        NotificationManager.showSuccess(`Default IDE saved for ${name}`);
      }
    } catch (error) {
      console.error("Error saving IDE preference:", error);
      NotificationManager.showError("Failed to save IDE preference");
    }
  },

  getItemIDE(type, name) {
    return this.itemPreferences.get(`${type}:${name}`) || this.getSelectedIDE();
  },

  getRawItemIDE(type, name) {
    return this.itemPreferences.get(`${type}:${name}`) || "";
  },

  bindEvents() {
    this.selector.addEventListener("change", (e) => {
      const selectedIDE = e.target.value;
      if (selectedIDE) {
        Storage.set(Storage.IDE_KEY, selectedIDE);
        NotificationManager.showSuccess(`Default IDE set to ${selectedIDE}`);
      }
    });
  },
};

// =======================
// Notification Management
// =======================
const NotificationManager = {
  show(message, type = "info", duration = 3000) {
    const colors = {
      success: "#4CAF50",
      error: "#F44336",
      info: "#2196F3",
    };

    const notification = Utils.createElement(
      "div",
      {
        style: `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        background: ${colors[type]};
        color: white;
        border-radius: 4px;
        z-index: 1000;
        transition: opacity 0.3s ease;
      `,
      },
      [message]
    );

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, duration);
  },

  showSuccess(message) {
    this.show(message, "success");
  },

  showError(message) {
    this.show(message, "error");
  },

  showInfo(message) {
    this.show(message, "info");
  },
};

// =======================
// Modal Management
// =======================
class Modal {
  constructor(modalId, formId, openBtnId) {
    this.modal = document.getElementById(modalId);
    this.form = document.getElementById(formId);
    this.openBtn = document.getElementById(openBtnId);
    this.closeBtn = this.modal.querySelector(".close");

    this.bindEvents();
  }

  bindEvents() {
    this.openBtn?.addEventListener("click", () => this.open());
    this.closeBtn?.addEventListener("click", () => this.close());

    // Close on outside click
    window.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });
  }

  open() {
    this.modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    this.onOpen();
  }

  close() {
    this.modal.style.display = "none";
    document.body.style.overflow = "auto";
    this.form?.reset();
    this.onClose();
  }

  isOpen() {
    return this.modal.style.display === "flex";
  }

  onOpen() {
    // Override in subclasses
  }

  onClose() {
    // Override in subclasses
  }
}

// =======================
// Repository Modal
// =======================
class RepositoryModal extends Modal {
  constructor() {
    super("add-repo-modal", "add-repo-form", "add-repo-btn");
    this.nameInput = document.getElementById("repo-name");
    this.pathInput = document.getElementById("repo-path");
    this.browseBtn = document.getElementById("browse-path");

    this.bindRepositoryEvents();
  }

  onOpen() {
    this.nameInput.focus();
  }

  bindRepositoryEvents() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.browseBtn.addEventListener("click", () => this.browsePath());
  }

  async handleSubmit(e) {
    e.preventDefault();

    const name = this.nameInput.value.trim();
    const path = this.pathInput.value.trim();

    if (!this.validateInputs(name, path)) return;

    try {
      await window.electronAPI.addRepository({ name, path });
      this.close();
      NotificationManager.showSuccess("Repository added successfully!");
      UIManager.refresh();
    } catch (error) {
      NotificationManager.showError(
        `Error adding repository: ${error.message}`
      );
    }
  }

  validateInputs(name, path) {
    if (!name || !path) {
      NotificationManager.showError("Please fill in all fields");
      return false;
    }
    return true;
  }

  async browsePath() {
    try {
      const path = await window.electronAPI.openDirectoryDialog();
      if (path) {
        this.pathInput.value = path;
      }
    } catch (error) {
      NotificationManager.showError(
        `Error selecting directory: ${error.message}`
      );
    }
  }
}

// =======================
// Edit Repository Modal
// =======================
class EditRepositoryModal extends Modal {
  constructor() {
    super("edit-repo-modal", "edit-repo-form");
    this.nameInput = document.getElementById("edit-repo-name");
    this.pathInput = document.getElementById("edit-repo-path");
    this.originalNameInput = document.getElementById("edit-original-name");
    this.browseBtn = document.getElementById("edit-browse-path");
    this.closeBtn = document.querySelector("#edit-repo-modal .close");

    this.bindEvents();
  }

  open(repo) {
    // Store original values
    this.originalNameInput.value = repo.name;

    // Set current values (read-only)
    document.getElementById("current-repo-name").textContent = repo.name;
    document.getElementById("current-repo-path").textContent = repo.path;

    // Clear and reset form fields
    this.nameInput.value = repo.name;
    this.pathInput.value = repo.path;
    this.nameInput.placeholder = `Current: ${repo.name}`;
    this.pathInput.placeholder = `Current: ${repo.path}`;

    // Open modal and focus
    super.open();
    this.nameInput.focus();
  }

  bindEvents() {
    this.form?.addEventListener("submit", (e) => this.handleSubmit(e));
    this.browseBtn?.addEventListener("click", () => this.browsePath());
    this.closeBtn?.addEventListener("click", () => this.close());
  }

  async handleSubmit(e) {
    e.preventDefault();

    const originalName = this.originalNameInput.value;
    const name = this.nameInput.value.trim() || originalName; // Use original name if new name is empty
    const path =
      this.pathInput.value.trim() ||
      this.pathInput.placeholder.replace("Current: ", ""); // Use current path if empty

    if (!this.validateInputs(name, path)) return;

    try {
      // Get current repositories data
      const data = await window.electronAPI.getReposData();

      // Ensure we have the expected data structure
      if (!data || typeof data !== "object" || !data.repos) {
        throw new Error("Invalid repository data structure");
      }

      // Check if the repository exists
      if (!data.repos[originalName]) {
        console.error("Repository not found in:", data.repos);
        throw new Error("Repository not found");
      }

      // Check if name is being changed to an existing one (except current repo)
      if (name !== originalName && data.repos[name]) {
        NotificationManager.showError(
          "A repository with this name already exists"
        );
        return;
      }

      // Create a copy of the repositories
      const updatedRepos = { ...data.repos };

      // If name changed, remove old entry
      if (name !== originalName) {
        delete updatedRepos[originalName];
      }

      // Update or add the repository with new values and updatedAt timestamp
      const now = new Date().toISOString();
      updatedRepos[name] = {
        path,
        updatedAt: data.repos[originalName]?.updatedAt || now,
      };

      // Save the updated repositories using the correct IPC method
      await window.electronAPI.writeReposFile({
        ...data,
        repos: updatedRepos,
      });

      // Refresh UI
      UIManager.refresh();

      NotificationManager.showSuccess("Repository updated successfully");
      this.close();
    } catch (error) {
      console.error("Error updating repository:", error);
      NotificationManager.showError(
        `Failed to update repository: ${error.message}`
      );
    }
  }

  validateInputs(name, path) {
    if (!name) {
      NotificationManager.showError("Please enter a repository name");
      return false;
    }
    if (!path) {
      NotificationManager.showError("Please select a repository path");
      return false;
    }
    return true;
  }

  async browsePath() {
    try {
      const path = await window.electronAPI.openDirectoryDialog();
      if (path) {
        this.pathInput.value = path;
      }
    } catch (error) {
      NotificationManager.showError(
        `Error selecting directory: ${error.message}`
      );
    }
  }
}

// =======================
// Edit Collection Modal
// =======================
class EditCollectionModal extends Modal {
  constructor() {
    super("edit-collection-modal", "edit-collection-form");
    this.nameInput = document.getElementById("edit-collection-name");
    this.originalNameInput = document.getElementById(
      "edit-original-collection-name"
    );
    this.currentNameEl = document.getElementById("current-collection-name");
    this.currentReposEl = document.getElementById("current-collection-repos");
    this.reposSelection = document.getElementById("edit-repos-selection");
    this.closeBtn = document.querySelector("#edit-collection-modal .close");

    this.bindEvents();
  }

  async open(collection) {
    // Store original values
    this.originalNameInput.value = collection.name;

    // Set current values
    this.currentNameEl.textContent = collection.name;

    // Handle both array and string formats for backward compatibility
    const repoList = Array.isArray(collection.repos)
      ? collection.repos
      : (collection.repos || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

    this.currentReposEl.textContent = repoList.length
      ? repoList.join(", ")
      : "No repositories";
    this.nameInput.value = collection.name;
    this.nameInput.placeholder = `Current: ${collection.name}`;

    // Load repositories with current selection
    await this.loadRepositories(repoList);

    // Open modal and focus
    super.open();
    this.nameInput.focus();
  }

  bindEvents() {
    this.form?.addEventListener("submit", (e) => this.handleSubmit(e));

    this.closeBtn?.addEventListener("click", () => this.close());
  }

  async loadRepositories(selectedRepos = []) {
    try {
      const data = await window.electronAPI.getReposData();
      this.renderRepositorySelection(data.repos || {}, selectedRepos);
    } catch (error) {
      NotificationManager.showError(
        `Error loading repositories: ${error.message}`
      );
      this.reposSelection.innerHTML =
        '<div class="error">Error loading repositories. Please try again.</div>';
    }
  }

  renderRepositorySelection(repos, selectedRepos = []) {
    if (!repos || Object.keys(repos).length === 0) {
      this.reposSelection.innerHTML =
        '<div class="loading">No repositories found. Add repositories first.</div>';
      return;
    }

    const reposList = Object.entries(repos)
      .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
      .map(
        ([name, repo]) => `
        <div class="repo-checkbox-item">
          <input type="checkbox" id="edit-repo-${name}" name="repos" value="${name}" 
                 ${selectedRepos.includes(name) ? "checked" : ""}>
          <label for="edit-repo-${name}">
            <span>${name}</span>
            <span class="repo-path">${repo.path}</span>
          </label>
        </div>
      `
      )
      .join("");

    this.reposSelection.innerHTML = reposList;
  }

  async handleSubmit(e) {
    e.preventDefault();

    const originalName = this.originalNameInput.value;
    const name = this.nameInput.value.trim();
    const selectedRepos = this.getSelectedRepositories();

    if (!this.validateInputs(name, selectedRepos)) return;

    try {
      const data = await window.electronAPI.getReposData();

      // Check if name is being changed to an existing one (except current collection)
      if (name !== originalName && data.collections && data.collections[name]) {
        NotificationManager.showError(
          "A collection with this name already exists"
        );
        return;
      }

      // Create a copy of the collections
      const updatedCollections = { ...data.collections };

      // Remove old entry if name changed
      if (name !== originalName) {
        delete updatedCollections[originalName];
      }

      // Update or add the collection with new values
      updatedCollections[name] = {
        name,
        repos: selectedRepos, // Save as array
        updatedAt:
          updatedCollections[originalName]?.updatedAt ||
          new Date().toISOString(),
      };

      // Save the updated collections
      await window.electronAPI.writeReposFile({
        ...data,
        collections: updatedCollections,
      });

      this.close();
      NotificationManager.showSuccess("Collection updated successfully");
      UIManager.refresh();
    } catch (error) {
      console.error("Error updating collection:", error);
      NotificationManager.showError(
        `Failed to update collection: ${error.message}`
      );
    }
  }

  getSelectedRepositories() {
    return Array.from(
      this.reposSelection.querySelectorAll('input[type="checkbox"]:checked')
    ).map((checkbox) => checkbox.value);
  }

  validateInputs(name, selectedRepos) {
    if (!name) {
      NotificationManager.showError("Please enter a collection name");
      return false;
    }

    if (selectedRepos.length === 0) {
      NotificationManager.showError("Please select at least one repository");
      return false;
    }

    return true;
  }
}

// =======================
// Collection Modal
// =======================
class CollectionModal extends Modal {
  constructor() {
    super("add-collection-modal", "add-collection-form", "add-collection-btn");
    this.nameInput = document.getElementById("collection-name");
    this.reposSelection = document.getElementById("repos-selection");

    this.bindCollectionEvents();
  }

  async onOpen() {
    this.nameInput.focus();
    await this.loadRepositories();
  }

  onClose() {
    this.reposSelection.innerHTML =
      '<div class="loading">Loading repositories...</div>';
  }

  bindCollectionEvents() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  async loadRepositories() {
    try {
      const data = await window.electronAPI.getReposData();
      this.renderRepositorySelection(data.repos || {});
    } catch (error) {
      NotificationManager.showError(
        `Error loading repositories: ${error.message}`
      );
      this.reposSelection.innerHTML =
        '<div class="error">Error loading repositories. Please try again.</div>';
    }
  }

  renderRepositorySelection(repos) {
    if (!repos || Object.keys(repos).length === 0) {
      this.reposSelection.innerHTML =
        '<div class="loading">No repositories found. Add repositories first.</div>';
      return;
    }

    const reposList = Object.entries(repos)
      .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
      .map(
        ([name, repo]) => `
        <div class="repo-checkbox-item">
          <input type="checkbox" id="repo-${name}" name="repos" value="${name}">
          <label for="repo-${name}">
            <span>${name}</span>
            <span class="repo-path">${repo.path}</span>
          </label>
        </div>
      `
      )
      .join("");

    this.reposSelection.innerHTML = reposList;
  }

  async handleSubmit(e) {
    e.preventDefault();

    const name = this.nameInput.value.trim();
    const selectedRepos = this.getSelectedRepositories();

    if (!this.validateInputs(name, selectedRepos)) return;

    try {
      await this.saveCollection(name, selectedRepos);
      this.close();
      NotificationManager.showSuccess("Collection created successfully!");
      UIManager.refresh();
    } catch (error) {
      NotificationManager.showError(
        `Error creating collection: ${error.message}`
      );
    }
  }

  getSelectedRepositories() {
    return Array.from(
      this.reposSelection.querySelectorAll('input[type="checkbox"]:checked')
    ).map((checkbox) => checkbox.value);
  }

  validateInputs(name, selectedRepos) {
    if (!name) {
      NotificationManager.showError("Please enter a collection name");
      return false;
    }

    if (selectedRepos.length === 0) {
      NotificationManager.showError("Please select at least one repository");
      return false;
    }

    return true;
  }

  async saveCollection(name, selectedRepos) {
    const data = await window.electronAPI.getReposData();

    if (data.collections && data.collections[name]) {
      throw new Error("A collection with this name already exists");
    }

    if (!data.collections) data.collections = {};
    data.collections[name] = {
      name,
      repos: selectedRepos,
      updatedAt: new Date().toISOString(),
    };

    await window.electronAPI.writeReposFile(data);
  }
}

// =======================
// UI Management
// =======================
const UIManager = {
  init(callbacks = {}) {
    this.searchInput = document.getElementById("search-input");
    this.refreshBtn = document.getElementById("refresh-btn");

    // Store callbacks
    this.handleEditRepository = callbacks.onEditRepository || (() => {});
    this.handleEditCollection = callbacks.onEditCollection || (() => {});

    // Initialize edit collection modal if it doesn't exist
    if (!this.editCollectionModal) {
      this.editCollectionModal = new EditCollectionModal();
    }

    this.bindEvents();
    this.refresh();
  },

  bindEvents() {
    // Debounce search to improve performance
    const debouncedUpdate = Utils.debounce(() => this.updateDisplay(), 300);
    this.searchInput.addEventListener("input", debouncedUpdate);
    this.refreshBtn.addEventListener("click", () => this.refresh());
  },

  async refresh() {
    this.showRefreshAnimation();

    try {
      const data = await window.electronAPI.getReposData();
      this.processData(data);
      this.updateDisplay();
    } catch (error) {
      NotificationManager.showError(`Error refreshing data: ${error.message}`);
    } finally {
      this.hideRefreshAnimation();
    }
  },

  processData(data) {
    // Clear existing item preferences to ensure we match source of truth
    IDEManager.itemPreferences.clear();

    // Process repositories
    if (data.repos) {
      const repos = Object.entries(data.repos).map(([name, repo]) => {
        if (repo.ide) {
          IDEManager.itemPreferences.set(`repo:${name}`, repo.ide);
        }
        return {
          name,
          path: repo.path,
          ide: repo.ide,
          updatedAt: repo.updatedAt || new Date().toISOString(),
        };
      });
      AppState.setRepos(repos);
    } else {
      AppState.setRepos([]);
    }

    // Process collections
    if (data.collections) {
      const collections = Object.values(data.collections).map((collection) => {
        if (collection.ide) {
          IDEManager.itemPreferences.set(
            `collection:${collection.name}`,
            collection.ide
          );
        }
        return {
          name: collection.name,
          repos: Array.isArray(collection.repos)
            ? collection.repos.join(", ")
            : "",
          ide: collection.ide,
          updatedAt: collection.updatedAt || new Date().toISOString(),
        };
      });
      AppState.setCollections(collections);
    } else {
      AppState.setCollections([]);
    }
  },

  updateDisplay() {
    const searchTerm = this.searchInput.value.trim();
    this.updateRepositoriesTable(AppState.getFilteredRepos(searchTerm));
    this.updateCollectionsTable(AppState.getFilteredCollections(searchTerm));
  },

  updateRepositoriesTable(repos) {
    const container = document.getElementById("repos-list");
    const table = document.getElementById("repos-table");
    const loading = document.getElementById("loading-repos");

    if (repos.length === 0) {
      loading.textContent = "No matching repositories found.";
      loading.style.display = "block";
      table.style.display = "none";
      return;
    }

    loading.style.display = "none";
    table.style.display = "table";

    container.innerHTML = repos
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((repo) => this.createRepositoryRow(repo))
      .join("");

    this.bindRepositoryEvents();
  },

  createRepositoryRow(repo) {
    const currentIDE = IDEManager.getRawItemIDE("repo", repo.name);
    const optionsHtml = AppState.IDE_OPTIONS.map(
      (opt) =>
        `<option value="${opt.value}" ${
          opt.value === currentIDE ? "selected" : ""
        }>${opt.label}</option>`
    ).join("");

    return `
      <tr data-path="${Utils.formatPath(repo.path)}" data-name="${
        repo.name
      }" class="clickable-repo-row">
        <td><strong>${repo.name}</strong></td>
        <td class="path">${Utils.formatPath(repo.path)}</td>
        <td class="actions">
          <div style="display: flex; gap: 5px; align-items: center;">
            <select class="row-ide-select" data-type="repo" data-name="${
              repo.name
            }" style="padding: 2px; margin-right: 5px; border-radius: 4px; border: 1px solid var(--border-dark); background: var(--card-bg); color: var(--text-color);" onclick="event.stopPropagation()">
              ${optionsHtml}
            </select>
            <button class="edit-btn" data-name="${repo.name}" data-path="${Utils.formatPath(
              repo.path
            )}" data-type="repo" title="Edit repository">✏️</button>
            <button class="delete-btn" data-name="${
              repo.name
            }" data-type="repo" title="Delete repository">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  },

  bindRepositoryEvents() {
    // Bind click events for opening repositories
    document.querySelectorAll(".clickable-repo-row").forEach((row) => {
      row.addEventListener("click", (e) => this.handleRepositoryClick(e, row));
    });

    // Bind per-row IDE selector events
    document
      .querySelectorAll('.row-ide-select[data-type="repo"]')
      .forEach((select) => {
        select.addEventListener("change", (e) => {
          e.stopPropagation();
          const name = e.target.dataset.name;
          const ide = e.target.value;
          IDEManager.setItemIDE("repo", name, ide);
        });

        // Prevent click propagation
        select.addEventListener("click", (e) => e.stopPropagation());
      });

    // Bind edit events
    document.querySelectorAll('.edit-btn[data-type="repo"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const name = btn.dataset.name;
        const path = btn.dataset.path;
        if (this.handleEditRepository) {
          this.handleEditRepository({ name, path });
        }
      });
    });

    // Bind delete events
    document
      .querySelectorAll('.delete-btn[data-type="repo"]')
      .forEach((btn) => {
        btn.addEventListener("click", (e) =>
          this.handleRepositoryDelete(e, btn)
        );
      });
  },

  async handleRepositoryClick(e, row) {
    if (e.target.tagName === "BUTTON" || e.target.tagName === "SELECT") return;

    const repoName = row.getAttribute("data-name");
    const repoPath = row.getAttribute("data-path");
    const selectedIDE = IDEManager.getItemIDE("repo", repoName);

    if (!selectedIDE) {
      NotificationManager.showError("Please select an IDE first");
      return;
    }

    if (!repoPath) return;

    try {
      const result = await window.electronAPI.openInIDE({
        name: repoName,
        path: repoPath,
        ide: selectedIDE,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to open in IDE");
      }

      NotificationManager.showSuccess(
        `Successfully opened ${repoPath} in ${selectedIDE}`
      );
    } catch (error) {
      NotificationManager.showError(`Error opening IDE: ${error.message}`);
    }
  },

  async handleRepositoryDelete(e, btn) {
    e.stopPropagation();

    const name = btn.getAttribute("data-name");
    // if (!confirm(`Are you sure you want to delete repository "${name}"?`))
    //   return;

    const loadingEl = this.showLoadingIndicator("Deleting...");

    try {
      const result = await window.electronAPI.deleteRepo(name);

      if (result?.success) {
        NotificationManager.showSuccess(`Successfully deleted ${name}`);
        this.updateDisplay();
      } else {
        throw new Error(result?.error || "Unknown error");
      }
    } catch (error) {
      NotificationManager.showError(`Error deleting ${name}: ${error.message}`);
    } finally {
      this.hideLoadingIndicator(loadingEl);
    }
  },

  updateCollectionsTable(collections) {
    const container = document.getElementById("collections-list");
    const table = document.getElementById("collections-table");
    const loading = document.getElementById("loading-collections");

    if (collections.length === 0) {
      loading.textContent = "No matching collections found.";
      loading.style.display = "block";
      table.style.display = "none";
      return;
    }

    loading.style.display = "none";
    table.style.display = "table";

    container.innerHTML = collections
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((collection) => this.createCollectionRow(collection))
      .join("");

    this.bindCollectionEvents();
  },

  createCollectionRow(collection) {
    const collectionData = JSON.stringify(collection).replace(/"/g, "&quot;");
    const currentIDE = IDEManager.getRawItemIDE("collection", collection.name);
    const optionsHtml = AppState.IDE_OPTIONS.map(
      (opt) =>
        `<option value="${opt.value}" ${
          opt.value === currentIDE ? "selected" : ""
        }>${opt.label}</option>`
    ).join("");

    return `
      <tr class="clickable-collection-row" data-collection="${collectionData}">
        <td><strong>${collection.name}</strong></td>
        <td>${collection.repos}</td>
        <td class="actions">
          <div style="display: flex; gap: 5px; align-items: center;">
            <select class="row-ide-select" data-type="collection" data-name="${
              collection.name
            }" style="padding: 2px; margin-right: 5px; border-radius: 4px; border: 1px solid var(--border-dark); background: var(--card-bg); color: var(--text-color);" onclick="event.stopPropagation()">
              ${optionsHtml}
            </select>
            <button class="edit-btn" data-name="${
              collection.name
            }" data-type="collection" title="Edit collection">✏️</button>
            <button class="delete-btn" data-name="${
              collection.name
            }" data-type="collection" title="Delete collection">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  },

  bindCollectionEvents() {
    // Bind click events for opening collections
    document.querySelectorAll(".clickable-collection-row").forEach((row) => {
      row.addEventListener("click", (e) => this.handleCollectionClick(e, row));
    });

    // Bind per-row IDE selector events
    document
      .querySelectorAll('.row-ide-select[data-type="collection"]')
      .forEach((select) => {
        select.addEventListener("change", (e) => {
          e.stopPropagation();
          const name = e.target.dataset.name;
          const ide = e.target.value;
          IDEManager.setItemIDE("collection", name, ide);
        });

        // Prevent click propagation
        select.addEventListener("click", (e) => e.stopPropagation());
      });

    // Bind edit events
    document
      .querySelectorAll('.edit-btn[data-type="collection"]')
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const collectionData = JSON.parse(
            btn
              .closest("tr")
              .getAttribute("data-collection")
              .replace(/&quot;/g, '"')
          );
          if (this.editCollectionModal) {
            this.editCollectionModal.open(collectionData);
          }
        });
      });

    // Bind delete events
    document
      .querySelectorAll('.delete-btn[data-type="collection"]')
      .forEach((btn) => {
        btn.addEventListener("click", (e) =>
          this.handleCollectionDelete(e, btn)
        );
      });
  },

  async handleCollectionClick(e, row) {
    if (e.target.tagName === "BUTTON" || e.target.tagName === "SELECT") return;

    try {
      const collection = JSON.parse(row.getAttribute("data-collection"));
      const reposData = await window.electronAPI.getReposData();

      const collectionIDE = IDEManager.getItemIDE(
        "collection",
        collection.name
      );

      const repos = collection.repos.split(",").map((repo) => {
        const [name, path, ide] = repo
          .trim()
          .split("|")
          .map((s) => s.trim());
        return { name, path, ide };
      });

      // Open all repositories in parallel
      const promises = repos.map(async (repo) => {
        const repoData = reposData.repos[repo.name];

        if (!repoData) {
          NotificationManager.showError(
            `${repo.name}: Not found in repositories`
          );
          return;
        }

        const ide = repo.ide || collectionIDE;

        try {
          await window.electronAPI.openInIDE({
            name: repo.name,
            path: repoData.path,
            ide: ide,
          });
        } catch (error) {
          NotificationManager.showError(
            `Failed to open ${repo.name}: ${error.message}`
          );
        }
      });

      await Promise.allSettled(promises);
      NotificationManager.showSuccess(`Successfully opened ${collection.name}`);
    } catch (error) {
      NotificationManager.showError(
        `Error processing collection: ${error.message}`
      );
    }
  },

  async handleCollectionDelete(e, btn) {
    e.stopPropagation();

    const name = btn.getAttribute("data-name");
    // if (!confirm(`Are you sure you want to delete collection "${name}"?`))
    //   return;

    const loadingEl = this.showLoadingIndicator("Deleting...");

    try {
      const result = await window.electronAPI.deleteCollection(name);

      if (result?.success) {
        NotificationManager.showSuccess(`Successfully deleted ${name}`);
        this.updateDisplay();
      } else {
        throw new Error(result?.error || "Unknown error");
      }
    } catch (error) {
      NotificationManager.showError(`Error deleting ${name}: ${error.message}`);
    } finally {
      this.hideLoadingIndicator(loadingEl);
    }
  },

  showRefreshAnimation() {
    this.refreshBtn.classList.add("rotating");
  },

  hideRefreshAnimation() {
    setTimeout(() => {
      this.refreshBtn.classList.remove("rotating");
    }, 1000);
  },

  showLoadingIndicator(text) {
    const indicator = Utils.createElement(
      "div",
      {
        style: `
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 10px;
        background: rgba(0,0,0,0.7);
        color: white;
        border-radius: 4px;
        z-index: 1000;
      `,
      },
      [text]
    );

    document.body.appendChild(indicator);
    return indicator;
  },

  hideLoadingIndicator(indicator) {
    if (document.body.contains(indicator)) {
      document.body.removeChild(indicator);
    }
  },
};

// =======================
// Application Initialization
// =======================
class App {
  constructor() {
    this.init();
  }

  init() {
    // Initialize core systems
    ThemeManager.init();
    IDEManager.init();

    // Initialize modals
    this.repositoryModal = new RepositoryModal();
    this.editRepositoryModal = new EditRepositoryModal();
    this.collectionModal = new CollectionModal();
    this.editCollectionModal = new EditCollectionModal();

    // Initialize UI manager with modals
    UIManager.init({
      onEditRepository: (repo) => this.editRepositoryModal.open(repo),
      onEditCollection: (collection) =>
        this.editCollectionModal.open(collection),
    });

    // Handle electron API data
    this.bindElectronEvents();

    console.log("👋 OpenMate application initialized successfully");
  }

  bindElectronEvents() {
    if (window.electronAPI && window.electronAPI.onReposData) {
      window.electronAPI.onReposData((data) => {
        const { repos = [], collections = [] } = data;
        AppState.setRepos(repos);
        AppState.setCollections(collections);
        UIManager.updateDisplay();
      });
    }
  }
}

// =======================
// Initialize Application
// =======================
document.addEventListener("DOMContentLoaded", () => {
  new App();
});

// Import styles
import "./index.css";
