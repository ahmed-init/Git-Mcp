import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import mcpserver from "./server.js"; //load mcp server

const transport = new StdioServerTransport(); //create communication channel

await mcpserver.connect(transport); //connect server to that channel

//server connected with communication channel waits for the client to connect
//MCP Client  ←──── communication channel ────→  MCP Server