import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

import { askLLM } from "./llm.js";

//client 
const client=new Client({
    name:"github-ai-client",
    version:"1.0.0"
});

//communication channel connected with server
const transport = new StdioClientTransport({
    command: "node",
    args: ["src/mcp/index.js"]
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
        mcpTools.tools.map(tool => tool.name)
    );

    llmTools = mcpTools.tools.map(tool => ({
        type: "function",
        function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.inputSchema
        }
    }));

    mcpConnected = true;

    return llmTools;
}
//execute the tool selected by llm based on the query
async function executeTool(toolCall) {

    const toolName = toolCall.function.name;

    const argumentsObject =
        JSON.parse(toolCall.function.arguments);

    console.log(
        `Calling MCP tool: ${toolName}`
    );

    const result = await client.callTool({
        name: toolName,
        arguments: argumentsObject
    });

    return result;
}

//ask the query to the llm and llm will execute the proper tool
//based on the user query
export async function askAssistant(question) {

    const messages = [
        {
    role: "system",
    content:
        "You are a GitHub repository assistant. " +
        "Use the available tools to inspect repositories and answer questions accurately. " +
        "Always format your answers clearly using Markdown. " +
        "Use headings for sections, bullet points for lists, " +
        "numbered lists for steps, and code blocks when showing code. " +
        "Always put file paths in backticks. " +
        "Keep explanations concise and easy to understand."

        },
        {
            role: "user",
            content: question
        }
    ];

    const llmTools=await initializeMCP();
    let response = await askLLM(
        messages,
        llmTools
    );

    while(response.tool_calls?.length){
        messages.push(response);
        for(const toolCall of response.tool_calls){
            const result=await executeTool(toolCall);

            messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(result)
            });

        }
        response =await askLLM(messages,llmTools);
    }
    return response.content;
}
