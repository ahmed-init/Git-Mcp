import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {z} from "zod";

import {
    getRepository,
    getRepositoryTree,
    getFileContent,
    searchRepository
} from "../services/githubService.js";


const mcpserver =new McpServer(
    {
        name:"github-repository-assistant",
        version:"1.30.0"
    }
);

//tool 1 for getting the repo info
mcpserver.tool(
    "get_repository",
    "Get basic information about a github repository",
    {
        owner:z.string().describe("Github repository owner"),
        repo:z.string().describe("Github repository name")
    },
    async({owner,repo})=>{
        const result=await getRepository(owner,repo);
        return {
            content:[
                {
                    type:"text",
                    text:JSON.stringify(result,null,2)
                }
            ]
        };
    }
);

// TOOL 2: Repository tree
mcpserver.tool(
    "get_repository_tree",
    "Get the complete file and folder structure of a GitHub repository",
    {
        owner: z.string().describe("GitHub repository owner"),
        repo: z.string().describe("GitHub repository name"),
        branch: z.string().default("main").describe("GitHub branch")
    },
    async ({ owner, repo, branch }) => {

        const result = await getRepositoryTree(
            owner,
            repo,
            branch
        );

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2)
                }
            ]
        };
    }
);


// TOOL 3: File content
mcpserver.tool(
    "get_file_content",
    "Get the contents of a file from a GitHub repository",
    {
        owner: z.string().describe("GitHub repository owner"),
        repo: z.string().describe("GitHub repository name"),
        path: z.string().describe("Path of the file"),
        branch: z.string().default("main").describe("GitHub branch")
    },
    async ({ owner, repo, path, branch }) => {

        const result = await getFileContent(
            owner,
            repo,
            path,
            branch
        );

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2)
                }
            ]
        };
    }
);


// TOOL 4: Search repository
mcpserver.tool(
    "search_repository",
    "Search for files in a GitHub repository by their path",
    {
        owner: z.string().describe("GitHub repository owner"),
        repo: z.string().describe("GitHub repository name"),
        query: z.string().describe("Search term"),
        branch: z.string().default("main").describe("GitHub branch")
    },
    async ({ owner, repo, query, branch }) => {

        const result = await searchRepository(
            owner,
            repo,
            query,
            branch
        );

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2)
                }
            ]
        };
    }
);

export default mcpserver;


/*           MCP
              │
       ┌──────┼──────┐
       │      │      │
       ▼      ▼      ▼
    Tool    Tool    Tool
       │      │      │
       └──────┼──────┘
              ▼
       GitHub Service
              │
              ▼
         GitHub API
*/