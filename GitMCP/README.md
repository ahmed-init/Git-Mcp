# GitHub AI Repository Assistant

An AI-powered GitHub repository assistant that allows users to ask questions about GitHub repositories using natural language..

The application combines an LLM with the Model Context Protocol (MCP) to intelligently inspect GitHub repositories, search files, retrieve source code, and provide clear explanations.

---

## 🚀 Features

- 🔍 Search files inside GitHub repositories
- 📁 Inspect complete repository structure
- 📄 Retrieve source-code files
- 📦 Retrieve repository information
- 🤖 AI-powered repository analysis
- 🧠 LLM-based tool selection
- 🔌 MCP client and MCP server architecture
- 💬 Conversational chat interface
- 📝 Markdown-formatted AI responses
- 🌐 GitHub REST API integration
- ⚡ Node.js + Express backend
- 🔐 Environment-based configuration
- 🛠️ Modular service/controller architecture

---

## 🏗️ Architecture

The application follows an AI + MCP architecture.

```text
                         User
                           │
                           ▼
                     Frontend UI
                           │
                           │ HTTP
                           ▼
                    Express Backend
                           │
                           ▼
                    Chat Controller
                           │
                           ▼
                     AI Assistant
                           │
                           ▼
                         LLM
                           │
                  Tool selection
                           │
                           ▼
                     MCP Client
                           │
                    MCP Protocol
                           │
                           ▼
                     MCP Server
                           │
          ┌────────────────┼─────────────────┐
          │                │                 │
          ▼                ▼                 ▼
   get_repository   get_repository_tree   search_repository
                                             │
                                      get_file_content
          │                │                 │
          └────────────────┼─────────────────┘
                           ▼
                      GitHub API
                           │
                           ▼
                     GitHub Repository
                           │
                           ▼
                         Result
                           │
                           ▼
                          LLM
                           │
                           ▼
                     AI Response
                           │
                           ▼
                      Frontend UI


How MCP used here...!

LLM
 ↓
MCP Client
 ↓
MCP Server
 ↓
GitHub Tools
 ↓
GitHub API


Detailed WorkFlow...!

1. User enters a question
        ↓
2. Frontend sends POST /api/chat
        ↓
3. Express receives the request
        ↓
4. Chat controller calls askAssistant()
        ↓
5. MCP client connects to MCP server
        ↓
6. Available MCP tools are provided to the LLM
        ↓
7. LLM decides which tool is required
        ↓
8. MCP client calls the selected tool
        ↓
9. MCP server executes the tool
        ↓
10. GitHub API is called
        ↓
11. Result is returned to the LLM
        ↓
12. LLM generates the final answer
        ↓
13. Express returns the response
        ↓
14. Frontend displays the answer


Project Structure

backend/
│
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── background.png
│   └── Castle.jpg
│
├── src/
│   │
│   ├── ai/
│   │   ├── assistant.js
│   │   └── llm.js
│   │
│   ├── config/
│   │   └── config.js
│   │
│   ├── controllers/
│   │   └── chatController.js
│   │
│   ├── mcp/
│   │   ├── server.js
│   │   ├── client.js
│   │   └── index.js
│   │
│   ├── routes/
│   │   ├── chatRoutes.js
│   │   └── repositoryRoutes.js
│   │
│   ├── services/
│   │   └── githubService.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md


Before Executing Make sure that you have these requirements filled...!
@.env
PORT=5000
GITHUB_TOKEN=your_github_token
OPENROUTER_API_KEY=your_openrouter_api_key


Installation...!

git clone <your-repository-url>
cd backend
npm install

npm run dev

finally 
http://localhost:5000

You can ask any questions to this assistant.
It will give you the best overview of the respective repository in a very efficient way.

Final Summary.
GitHub AI Repository Assistant

The GitHub AI Repository Assistant is an AI-powered developer tool designed to help users understand and explore GitHub repositories through natural-language questions. The application combines Node.js, Express, the GitHub REST API, Large Language Models (LLMs), and the Model Context Protocol (MCP) to create an intelligent repository analysis system.

The system provides a conversational web interface where users can ask questions about a GitHub repository. The backend receives the user's question through an Express API and forwards it to an AI assistant. The AI assistant is connected to an MCP client, which communicates with a custom MCP server through the MCP protocol.

The MCP server exposes four primary GitHub tools: repository information retrieval, repository tree inspection, file-content retrieval, and repository searching. Based on the user's question, the LLM can determine which tool is required, and the MCP client requests that tool from the MCP server. The MCP server then communicates with the GitHub API and returns the requested repository information.

The retrieved information is provided back to the LLM, which analyzes the repository data and generates a human-readable response. The frontend then displays the response using Markdown formatting, allowing headings, lists, code snippets, and file paths to be presented clearly.

The project demonstrates how LLM tool calling and MCP can connect an AI system to external developer tools and services. Instead of manually browsing a repository, users can ask questions such as where a particular file is located, how a specific file works, or how different parts of a project are structured.

Overall, the project serves as a practical implementation of an AI-powered GitHub development assistant, demonstrating MCP client-server communication, API integration, LLM-based tool selection, backend architecture, and AI-assisted source-code analysis.


yet to deploy...!
