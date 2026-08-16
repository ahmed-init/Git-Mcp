import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import mcpserver from "./server.js";

const transport = new StdioServerTransport();

await mcpserver.connect(transport);