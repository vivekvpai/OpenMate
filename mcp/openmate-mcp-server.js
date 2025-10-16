import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from 'fs';
import path from 'path';
import os from 'os';

// Configuration
const STORE_DIR = path.join(os.homedir(), ".openmate");
const STORE_FILE = path.join(STORE_DIR, "repos.json");

// Helper functions
function ensureStore() {
  if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });
  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(
      STORE_FILE,
      JSON.stringify({ version: 2, repos: {}, collections: {} }, null, 2),
      { mode: 0o600 }
    );
  }
}

function loadStore() {
  ensureStore();
  try {
    const data = JSON.parse(fs.readFileSync(STORE_FILE, "utf8"));
    if (!data.repos) data.repos = {};
    if (!data.collections) data.collections = {};
    return data;
  } catch (e) {
    console.error("Error reading store. Recreating...");
    const defaultStore = { version: 2, repos: {}, collections: {} };
    fs.writeFileSync(STORE_FILE, JSON.stringify(defaultStore, null, 2), {
      mode: 0o600,
    });
    return defaultStore;
  }
}

function saveStore(store) {
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
}

function normalizeName(name) {
  if (!name || typeof name !== "string") return "";
  return name.trim().toLowerCase();
}

// Create server instance with minimal capabilities
const server = new McpServer({
  name: "openmate",
  version: "1.0.0",
});

// List repositories and collections
server.tool(
  "list-repos",
  "List all repositories and collections",
  {
    type: z.enum(["all", "repos", "collections"]).optional().default("all").describe("What to list: all, repos only, or collections only")
  },
  async ({ type = "all" }) => {
    try {
      const store = loadStore();
      const result = {};
      
      if (type === "all" || type === "repos") {
        const repoEntries = Object.entries(store.repos);
        result.repositories = repoEntries.map(([name, data]) => {
          const repoPath = typeof data === 'string' ? data : data.path;
          return {
            name,
            path: repoPath,
            addedAt: typeof data === 'object' ? data.addedAt : null
          };
        });
        
        if (repoEntries.length === 0) {
          result.repositories = ["No repositories found"];
        }
      }
      
      if (type === "all" || type === "collections") {
        const collectionEntries = Object.entries(store.collections);
        result.collections = collectionEntries.map(([name, data]) => {
          const repos = data.repos || (Array.isArray(data) ? data : []);
          return {
            name,
            repositoryCount: repos.length,
            repositories: repos
          };
        });
        
        if (collectionEntries.length === 0) {
          result.collections = ["No collections found"];
        }
      }
      
      // Format the output for better readability
      let output = "";
      
      if (result.repositories && result.repositories.length > 0) {
        output += "📁 Repositories:\n";
        if (Array.isArray(result.repositories) && result.repositories[0] === "No repositories found") {
          output += "  No repositories found\n";
        } else {
          result.repositories.forEach((repo, index) => {
            output += `  ${index + 1}. ${repo.name} -> ${repo.path}\n`;
          });
        }
        output += "\n";
      }
      
      if (result.collections && result.collections.length > 0) {
        output += "📚 Collections:\n";
        if (Array.isArray(result.collections) && result.collections[0] === "No collections found") {
          output += "  No collections found\n";
        } else {
          result.collections.forEach((collection, index) => {
            output += `  ${index + 1}. ${collection.name} (${collection.repositoryCount} repos)\n`;
            if (collection.repositories && collection.repositories.length > 0) {
              output += `     Repos: ${collection.repositories.join(', ')}\n`;
            }
          });
        }
      }
      
      if (!output) {
        output = "No repositories or collections found.";
      }
      
      return {
        content: [{
          type: "text",
          text: output
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error listing repos: ${error.message}`
        }]
      };
    }
  }
);

// Add a new repository
server.tool(
  "add-repo",
  "Add a new repository to OpenMate",
  {
    name: z.string().min(1).describe("The name to identify this repository"),
    path: z.string().min(1).describe("The filesystem path to the repository")
  },
  async ({ name, path: repoPath }) => {
    try {
      const store = loadStore();
      const normalized = normalizeName(name);
      
      if (store.repos[normalized]) {
        return {
          content: [{
            type: "text",
            text: `❌ Error: Repository '${name}' already exists`
          }]
        };
      }
      
      // Expand ~ to home directory and resolve the path
      const expandedPath = repoPath.replace(/^~(?=$|[\\/])/, os.homedir());
      const resolvedPath = path.resolve(expandedPath);
      
      // Ensure the path exists and is a directory
      const stats = fs.statSync(resolvedPath);
      if (!stats.isDirectory()) {
        throw new Error('Path is not a directory');
      }
      
      store.repos[normalized] = {
        path: resolvedPath,
        addedAt: new Date().toISOString()
      };
      saveStore(store);
      
      return {
        content: [{
          type: "text",
          text: `✅ Successfully added repository '${name}' -> '${resolvedPath}'`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Error: Invalid repository path '${repoPath}'. ${error.message}`
        }]
      };
    }
  }
);

// Get repository path
server.tool(
  "get-repo",
  "Get the path of a repository by name",
  {
    name: z.string().min(1).describe("The name of the repository to look up")
  },
  async ({ name }) => {
    try {
      const store = loadStore();
      const normalized = normalizeName(name);
      const repoData = store.repos[normalized];
      
      if (!repoData) {
        // Try to find partial matches
        const matches = Object.keys(store.repos).filter(key => 
          key.includes(normalized) || normalized.includes(key)
        );
        
        let message = `❌ Error: Repository '${name}' not found`;
        if (matches.length > 0) {
          message += `\nDid you mean: ${matches.join(', ')}?`;
        }
        
        return {
          content: [{
            type: "text",
            text: message
          }]
        };
      }
      
      const repoPath = typeof repoData === 'string' ? repoData : repoData.path;
      
      return {
        content: [{
          type: "text",
          text: repoPath
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Error: ${error.message}`
        }]
      };
    }
  }
);

// Remove a repository
server.tool(
  "remove-repo",
  "Remove a repository from OpenMate",
  {
    name: z.string().min(1).describe("The name of the repository to remove")
  },
  async ({ name }) => {
    try {
      const store = loadStore();
      const normalized = normalizeName(name);
      
      if (!store.repos[normalized]) {
        return {
          content: [{
            type: "text",
            text: `❌ Error: Repository '${name}' not found`
          }]
        };
      }
      
      delete store.repos[normalized];
      saveStore(store);
      
      return {
        content: [{
          type: "text",
          text: `✅ Successfully removed repository '${name}'`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Error: ${error.message}`
        }]
      };
    }
  }
);

// Add a collection
server.tool(
  "add-collection",
  "Create a collection of repositories",
  {
    name: z.string().min(1).describe("The name of the collection"),
    repos: z.string().min(1).describe("Comma-separated list of repository names to include in this collection")
  },
  async ({ name, repos }) => {
    try {
      const store = loadStore();
      const normalized = normalizeName(name);
      const repoList = repos.split(',').map(r => normalizeName(r.trim()));
      
      // Verify all repos exist
      const missingRepos = repoList.filter(r => !store.repos[r]);
      if (missingRepos.length > 0) {
        return {
          content: [{
            type: "text",
            text: `❌ Error: The following repositories do not exist: ${missingRepos.join(', ')}`
          }]
        };
      }
      
      store.collections[normalized] = {
        name: name,
        repos: repoList,
        createdAt: new Date().toISOString()
      };
      saveStore(store);
      
      return {
        content: [{
          type: "text",
          text: `✅ Successfully created collection '${name}' with ${repoList.length} repositories: ${repoList.join(', ')}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Error: ${error.message}`
        }]
      };
    }
  }
);

// List repositories in a collection (with optional name)
server.tool(
  "list-collection",
  "List repositories in a collection, or list all collections if no name provided",
  {
    name: z.string().optional().describe("Optional: The name of the collection to list. If not provided, shows all collections.")
  },
  async ({ name }) => {
    try {
      const store = loadStore();
      
      // If no name provided, list all collections
      if (!name || name.trim() === '') {
        const collectionEntries = Object.entries(store.collections);
        
        if (collectionEntries.length === 0) {
          return {
            content: [{
              type: "text",
              text: "No collections found. Use 'add-collection' to create one."
            }]
          };
        }
        
        let output = "📚 Available Collections:\n";
        collectionEntries.forEach(([key, collection], index) => {
          const repos = collection.repos || (Array.isArray(collection) ? collection : []);
          output += `  ${index + 1}. ${collection.name || key} (${repos.length} repos)\n`;
          if (repos.length > 0) {
            output += `     Contains: ${repos.join(', ')}\n`;
          }
        });
        
        return {
          content: [{
            type: "text",
            text: output
          }]
        };
      }
      
      // List specific collection
      const normalized = normalizeName(name);
      const collection = store.collections[normalized];
      
      if (!collection) {
        // Try to find partial matches
        const matches = Object.keys(store.collections).filter(key => 
          key.includes(normalized) || normalized.includes(key)
        );
        
        let message = `❌ Error: Collection '${name}' not found`;
        if (matches.length > 0) {
          message += `\nDid you mean: ${matches.join(', ')}?`;
        } else {
          message += "\nUse 'list-collection' without arguments to see all available collections.";
        }
        
        return {
          content: [{
            type: "text",
            text: message
          }]
        };
      }
      
      const repos = (collection.repos || (Array.isArray(collection) ? collection : []));
      
      if (repos.length === 0) {
        return {
          content: [{
            type: "text",
            text: `Collection '${name}' exists but contains no repositories.`
          }]
        };
      }
      
      let output = `📚 Collection: ${name}\n`;
      output += `Contains ${repos.length} repositories:\n\n`;
      
      repos.forEach((repoName, index) => {
        const repoData = store.repos[repoName];
        const repoPath = repoData ? (typeof repoData === 'string' ? repoData : repoData.path) : 'Not found';
        const status = repoData ? '✅' : '❌';
        output += `  ${index + 1}. ${status} ${repoName}\n`;
        output += `     Path: ${repoPath}\n`;
      });
      
      return {
        content: [{
          type: "text",
          text: output
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Error: ${error.message}`
        }]
      };
    }
  }
);

// Initialize current directory as a repository
server.tool(
  "init-repo",
  "Add the current directory as a repository",
  {
    name: z.string().min(1).describe("The name to assign to the current directory")
  },
  async ({ name }) => {
    try {
      const currentDir = process.cwd();
      const store = loadStore();
      const normalized = normalizeName(name);
      
      if (store.repos[normalized]) {
        return {
          content: [{
            type: "text",
            text: `❌ Error: Repository '${name}' already exists`
          }]
        };
      }
      
      store.repos[normalized] = {
        path: currentDir,
        addedAt: new Date().toISOString()
      };
      saveStore(store);
      
      return {
        content: [{
          type: "text",
          text: `✅ Successfully added current directory as repository '${name}' -> '${currentDir}'`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `❌ Error: ${error.message}`
        }]
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("OpenMate MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});