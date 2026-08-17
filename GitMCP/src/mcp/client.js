import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client({
    name: "github-ai-client",
    version: "1.30.0"
});

//client wants to start the server for its communication
const transport = new StdioClientTransport({
    command: "node",
    args: ["src/mcp/index.js"]
});

await client.connect(transport);

console.log("MCP client connected");

const tools = await client.listTools();

console.log("Available tools:");
console.log(tools.tools);


/*

                   USER
                     │
                     ▼
                   LLM 🧠
                     │
                     ▼
               MCP CLIENT 🔌
                     │
                     ▼
               MCP SERVER 🧰
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       get_repo    get_tree   search
                                  │
                                  ▼
                             get_file
                                  │
                                  ▼
                            GitHub API
                            
*/