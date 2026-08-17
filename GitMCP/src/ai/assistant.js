import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

import { askLLM } from "./llm.js";

//client
const client = new Client({
  name: "github-ai-client",
  version: "1.0.0",
});

//communication channel connected with server
const transport = new StdioClientTransport({
  command: "node",
  args: ["src/mcp/index.js"],
});

//client connected with communication channel+server
let mcpConnected = false;
let llmTools = null;

async function initializeMCP() {
  if (mcpConnected) {
    return llmTools;
  }

  await client.connect(transport);

  console.log("Connected to MCP server");

  const mcpTools = await client.listTools();

  console.log(
    "MCP tools:",
    mcpTools.tools.map((tool) => tool.name),
  );

  llmTools = mcpTools.tools.map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    },
  }));

  mcpConnected = true;

  return llmTools;
}
//execute the tool selected by llm based on the query
async function executeTool(toolCall) {
  const toolName = toolCall.function.name;

  const argumentsObject = JSON.parse(toolCall.function.arguments);

  console.log(`Calling MCP tool: ${toolName}`);

  const result = await client.callTool({
    name: toolName,
    arguments: argumentsObject,
  });

  /*
   * Prevent huge GitHub files from being sent
   * directly into the LLM context.
   */
  const MAX_FILE_CHARS = 12000;
  const MAX_RESULT_CHARS = 30000;

  let resultText = JSON.stringify(result);

  // Limit individual file content
  if (resultText.length > MAX_RESULT_CHARS) {
    resultText = resultText.substring(0, MAX_RESULT_CHARS);

    resultText += "\n\n[Result truncated because it was too large.]";
  }

  return resultText;
}

//ask the query to the llm and llm will execute the proper tool
//based on the user query
export async function askAssistant(question) {
  let conversationHistory = [];
  const messages = [
    {
      role: "system",
      //tuning the prompt
      content:
               "You are a GitHub repository assistant. " +
        "Use the available MCP tools to inspect repositories and answer accurately. " +

        "For broad questions, first inspect the repository structure " +
        "and then read only the most relevant files such as README.md, " +
        "package.json, entry points, configuration files, database files, " +
        "routes, controllers, and important services. " +

        "Do not repeatedly inspect the same files. " +
        "Do not read every file in the repository. " +
        "Use only the files necessary to answer the question. " +
        "If enough information has been collected, stop using tools and answer. " +

        "Remember the conversation and understand follow-up questions. " +

        "If a GitHub tool fails, do not guess the reason. " +
        "Report the actual error returned by the tool. " +

        "Always format answers using Markdown. " +
        "Use headings, bullet points, numbered lists, and code blocks when appropriate. " +
        "Always put file paths in backticks. " +
        "Keep explanations clear and concise."
    },
    ...conversationHistory,
    {
      role: "user",
      content: question,
    },
  ];

  const llmTools = await initializeMCP();
  let response = await askLLM(messages, llmTools);

 let toolRounds = 0;
const MAX_TOOL_ROUNDS = 6;

while (
    response.tool_calls?.length &&
    toolRounds < MAX_TOOL_ROUNDS
) {

    toolRounds++;

    messages.push(response);

    for (const toolCall of response.tool_calls) {

        const result = await executeTool(toolCall);

        messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: result
        });
    }

    response = await askLLM(
        messages,
        llmTools
    );
}
  // Save the conversation
  conversationHistory.push({
    role: "user",
    content: question,
  });

  conversationHistory.push({
    role: "assistant",
    content: response.content,
  });
  conversationHistory = conversationHistory.slice(-6);

  return response.content;
}
