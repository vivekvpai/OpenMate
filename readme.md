# OpenMate (`om`)

[![Visitors](https://visitor-badge.laobi.icu/badge?page_id=openmate.project)](https://github.com/openmate/project)
[![NPM Downloads](https://img.shields.io/npm/dt/openmate)](https://www.npmjs.com/package/openmate)
[![NPM Version](https://img.shields.io/npm/v/openmate)](https://www.npmjs.com/package/openmate)
[![GitHub Stars](https://img.shields.io/github/stars/openmate/project?style=social)](https://github.com/openmate/project)
[![License](https://img.shields.io/github/license/openmate/project)](https://github.com/openmate/project/blob/main/LICENSE)

A fast and friendly CLI tool to manage and open your **local repositories (code directories)** in **VS Code**, **Windsurf**, or **Cursor** with quick shortcuts. Perfect for developers who frequently switch between projects.

> **Note:** Here "repo" refers to your **local project folder (code directory)**, not a remote GitHub / GitLab / Bitbucket repository.

---

## ✅ Features
- Add and manage shortcuts for your local repos.
- Open repos in **VS Code**, **Windsurf**, or **Cursor** instantly.
- **Collections**: Group multiple repos under a collection and open all at once.
- Simple CLI commands with intuitive flags.

---

## 🔧 Installation
```bash
npm install -g openmate
```

---

## 🚀 Usage

### **Add a repo**
```bash
om add myrepo /path/to/project
```

### **Add a collection of repos**
```bash
om add -c mycollection repo1,repo2,repo3
```

### **Update a collection**
```bash
om update -c mycollection newrepo1,newrepo2
```

### **Delete a collection**
```bash
om delete -c mycollection
```

### **Open a repo**
```bash
om ws myrepo
```

### **Open all repos in a collection**
```bash
om ws -c mycollection
```

### **List all repos**
```bash
om list -r
```

### **List all collections**
```bash
om list -c
```

---

## 🛠 Editors Supported
- **VS Code** (default)
- **Windsurf** (with `-w` flag)
- **Cursor** (with `-cu` flag)

Example:
```bash
om ws myrepo -w
om ws myrepo -cu
```

---

## 📂 Config File
OpenMate stores its config in a JSON file at:
```
~/.openmate/config.json
```
This includes all your repo shortcuts and collections.

---

## ✅ Example Config
```json
{
  "repos": {
    "repo1": "/Users/you/projects/repo1",
    "repo2": "/Users/you/projects/repo2"
  },
  "collections": {
    "mycollection": ["repo1", "repo2", "repo3"]
  }
}
```

---

## 📜 License
MIT License © 2025 [OpenMate Team](https://github.com/openmate/project)
