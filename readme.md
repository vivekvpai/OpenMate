# OpenMate (`om`)

[![Visitors](https://visitor-badge.laobi.icu/badge?page_id=vivekvpai.OpenMate)](https://github.com/vivekvpai/OpenMate)
[![NPM Downloads](https://img.shields.io/npm/dt/openmate)](https://www.npmjs.com/package/openmate)
[![NPM Version](https://img.shields.io/npm/v/openmate)](https://www.npmjs.com/package/openmate)
[![GitHub Stars](https://img.shields.io/github/stars/vivekvpai/OpenMate?style=social)](https://github.com/vivekvpai/OpenMate)
[![License](https://img.shields.io/github/license/vivekvpai/OpenMate)](https://github.com/vivekvpai/OpenMate/blob/main/LICENSE)

A fast and friendly CLI tool to manage and open your local repositories in **VS Code**, **Windsurf**, or **Cursor** with quick shortcuts. Perfect for developers who frequently switch between projects.

✨ **New in v2.0.0**: Now with **Collections** - Group related repositories together and open them all at once!

---

## ✅ Features

* Add and store repository paths by name
* Open repositories in **VS Code** (`om vs <name>`)
* Open repositories in **Windsurf** (`om ws <name>`)
* Open repositories in **Cursor** (`om cs <name>`)
* Update or remove stored repos
* Print the stored path of a repo
* List all stored repositories and collections
* **Collections**:
  - Group related repositories together and open them all at once
  - View detailed repository list for a specific collection (`om list <collection>`)
  - List all collections with `om list -c`
* Lightweight and super easy to use

---

## 📌 Notes & OS Compatibility

* Supported editors: **VS Code**, **Windsurf**, and **Cursor**.
* On **Windows**, use double quotes for paths.
---

## 📦 Installation

Install globally via **npm**:

```bash
npm install -g openmate
```

Verify installation:

```bash
om --version
```

---

## ⚡ Usage

### **Available Commands**

#### Repository Management
```
om add <name> "<path/to/repo>"        Add a repo (no duplicate names)
om update <name> "<new/path>"         Update stored path for existing name
om remove <name>                      Remove stored repo
om list                               List all stored repos
om path <name>                        Print the stored path
```

#### Collection Management
```
om add -c <name> <repo1,repo2,...>    Add/update a collection of repos
om update -c <name> <repo1,repo2,...> Update a collection's repos
om remove -c <name>                   Remove a collection
om list -c                            List all collections
om list <collection>                  Show details of a specific collection
```

#### Open Repositories/Collections
```
om vs <name>                          Open repo/collection in VS Code
om ws <name>                          Open repo/collection in Windsurf
om cs <name>                          Open repo/collection in Cursor
```

---

### **Examples**

#### Basic Repository Usage
```bash
# Add and open a single repository
om add myrepo "~/work/my-repo"
om vs myrepo
om ws myrepo
om cs myrepo

# Update or remove a repository
om update myrepo "/data/projects/my-repo"
om remove myrepo
```

#### List Repositories and Collections

```bash
# List all repositories and collections
om list

# List only repositories
om list -r

# List only collections
om list -c

# View details of a specific collection
om list <collection-name>
# Example:
om list frontend

# When collection doesn't exist
om list nonexistent
# Output: ❌ Collection "nonexistent" not found.
#         Available collections:
#           1. frontend
```

#### Working with Collections
```bash
# Create a collection of related repositories
om add -c frontend "webapp,api,dashboard,admin"

# Open all repos in a collection in VS Code
om vs frontend

# Update a collection
om update -c frontend "webapp,api,dashboard,admin,shared"

# List all collections
om list -c

# Remove a collection
om remove -c frontend
```

---

## 🛠 Options

```
--version, -v     Show the current version
--help            Show usage guide
```

---

### Sample Outputs

#### `om list`
```
Repositories:
┌─────┬───────────┬───────────────────────────────┬───────────────────────┐
│ #   │ Name      │ Path                          │ Added At              │
├─────┼───────────┼───────────────────────────────┼───────────────────────┤
│ 1   │ stuser    │ /projects/shopprop-user       │ 2025-08-29T12:00:00Z │
│ 2   │ stagent   │ /projects/shopprop-agent      │ 2025-08-29T12:00:00Z │
│ 3   │ stapp     │ /projects/shopprop-app        │ 2025-08-29T12:00:00Z │
│ 4   │ stdashboard/projects/shopprop-dashboard   │ 2025-08-29T12:00:00Z │
└─────┴───────────┴───────────────────────────────┴───────────────────────┘
```

#### `om list -c`
```
Collections:
┌───────────┬───────┬───────────────────────┐
│ Name      │ Repos │ Updated At            │
├───────────┼───────┼───────────────────────┤
│ shopprop  │ 4     │ 2025-08-29T12:00:00Z │
│ work      │ 3     │ 2025-08-28T10:30:00Z │
└───────────┴───────┴───────────────────────┘
```

---

## 🔧 Requirements

### **General**
* **Node.js** (>= 14.x)

### **Windows**
* **VS Code**, **Windsurf**, or **Cursor** installed and added to PATH
* CLI commands `code`, `windsurf`, or `cursor` must be available in terminal

### **macOS**
* **VS Code**, **Windsurf**, or **Cursor** installed in `/Applications`
* No CLI needed; uses `open -a` internally

---

## 📂 How It Works

* Stores repo names and paths in a local JSON file (`~/.openmate/repos.json`)
* Uses system commands to open editors
* macOS uses `open -a <AppName>` for launching apps

---

## 📝 License

MIT License © 2025 Pai
