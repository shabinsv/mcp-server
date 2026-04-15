require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { StreamableHTTPServerTransport } = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const { createMcpServer, PORT, API_BASE_URL } = require("./mcp");

const app = express();

app.use(express.json());
app.use(cors());

app.post("/mcp", async (req, res) => {
  console.log("post");
  
  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("MCP request error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: error.message || "Internal server error",
        },
        id: null,
      });
    }
  } finally {
    res.on("close", () => {
      transport.close().catch(() => {});
      server.close().catch(() => {});
    });
  }
});

app.get("/mcp", (req, res) => {
    console.log("get");
  res.status(405).json({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed. Use POST for MCP.",
    },
    id: null,
  });
});

app.listen(PORT, () => {
  console.log(
    `MCP server (streamable HTTP) listening on port ${PORT}, endpoint POST /mcp (no auth)`
  );
  console.log(`API base: ${API_BASE_URL}`);
});