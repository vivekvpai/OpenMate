# OpenMate (`om`)

[![Visitors](https://visitor-badge.laobi.icu/badge?page_id=vivekvpai.OpenMate)](https://github.com/vivekvpai/OpenMate)
[![NPM Downloads](https://img.shields.io/npm/dt/openmate)](https://www.npmjs.com/package/openmate)
[![NPM Version](https://img.shields.io/npm/v/openmate)](https://www.npmjs.com/package/openmate)
[![GitHub Stars](https://img.shields.io/github/stars/vivekvpai/OpenMate?style=social)](https://github.com/vivekvpai/OpenMate)
[![License](https://img.shields.io/github/license/vivekvpai/OpenMate)](https://github.com/vivekvpai/OpenMate/blob/main/LICENSE)


A fast and friendly CLI tool to manage and open your local repositories in **VS Code**, **Windsurf**, or **Cursor** with quick shortcuts. Perfect for developers who frequently switch between projects.

---

## ✅ Features

* Add and store repository paths by name
* Open repositories in **VS Code** (`om vs <name>`)
* Open repositories in **Windsurf** (`om ws <name>`)
* Open repositories in **Cursor** (`om cs <name>`)
* Update or remove stored repos
* Print the stored path of a repo
* List all stored repositories
* Lightweight and super easy to use

---

## 📌 Notes & OS Compatibility

* Supported editors: **VS Code**, **Windsurf**, and **Cursor**.
* On **Windows**, use double quotes for paths.
* On **macOS**, uses `open -a` for apps (no CLI required for editors).

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

```
om add <name> "<path/to/repo>"        Add a repo (no duplicate names)
om update <name> "<new/path>"         Update stored path for existing name
om remove <name>                      Remove stored repo
om vs <name>                          Open repo in VS Code
om ws <name>                          Open repo in Windsurf
om cs <name>                          Open repo in Cursor
om list                               List stored repos
om path <name>                        Print the stored path
```

---

### **Examples**

```bash
om add myrepo "~/work/my-repo"
om vs myrepo
om ws myrepo
om cs myrepo
om update myrepo "/data/projects/my-repo"
om remove myrepo
```

---

## 🛠 Options

```
--version, -v     Show the current version
--help            Show usage guide
```

---

### Sample Output of `om list`

| # | Name     | Repo Path         |
| - | -------- | ----------------- |
| 1 | project1 | /path/to/project1 |
| 2 | project2 | /path/to/project2 |
| 3 | project3 | /path/to/project3 |
| 4 | frontend | /path/to/frontend |
| 5 | backend  | /path/to/backend  |

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
