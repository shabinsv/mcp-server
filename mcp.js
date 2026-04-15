const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const z = require("zod");
const { API_BASE_URL, VALID_CATEGORIES } = require("./api");
const { registerPostTools, registerPostsGuide } = require("./tools/posts");
const { registerCommentTools, registerWorkflowPrompt } = require("./tools/comments");

const PORT = process.env.MCP_PORT || 3001;

function createMcpServer() {
  const server = new McpServer(
    {
      name: "posts-api-mcp",
      version: "1.0.0",
      description: "MCP server that exposes Posts & Comments API as tools",
    },
    { capabilities: { tools: {}, resources: {}, prompts: {} } }
  );

  registerPostTools(server, z, VALID_CATEGORIES);
  registerCommentTools(server, z);
  registerPostsGuide(server);
  registerWorkflowPrompt(server);

  return server;
}

module.exports = {
  API_BASE_URL,
  PORT,
  createMcpServer,
};
