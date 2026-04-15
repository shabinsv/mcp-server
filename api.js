const API_BASE_URL = process.env.API_BASE_URL;
const VALID_CATEGORIES = ["tech", "finance", "lifestyle"];
const { logError, logRequest, logResponse } = require("./logger");

async function apiRequest(method, endpoint, body) {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(body);
  }

  logRequest(method, url);

  let hasLoggedError = false;

  try {
    const response = await fetch(url, options);
    const text = await response.text();

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = text || {};
    }

    if (!response.ok) {
      const error = new Error(
        (data && data.error) || response.statusText || `HTTP ${response.status}`
      );
      logError(method, url, data);
      hasLoggedError = true;
      throw error;
    }

    logResponse(method, url, data);
    return data;
  } catch (error) {
    if (!hasLoggedError) {
      logError(method, url, error);
    }
    throw error;
  }
}

function validatePostInput(args) {
  if (!args.title || typeof args.title !== "string") return "title is required";
  if (args.title.trim().length < 5) return "title must be at least 5 characters";
  if (!args.author || typeof args.author !== "string") return "author is required";
  if (args.author.trim().length < 3) return "author must be at least 3 characters";
  if (!args.category || typeof args.category !== "string") return "category is required";
  if (!VALID_CATEGORIES.includes(args.category)) return "Invalid category";
  if (!args.body || typeof args.body !== "string") return "body is required";
  if (args.body.trim().length < 50) return "body must be at least 50 characters";

  return null;
}

function validateCommentInput(args) {
  if (!args.text || typeof args.text !== "string") return "text is required";
  if (args.text.trim().length < 10) return "text must be at least 10 characters";
  if (!args.commenter || typeof args.commenter !== "string") return "commenter is required";

  return null;
}

module.exports = {
  API_BASE_URL,
  VALID_CATEGORIES,
  apiRequest,
  validatePostInput,
  validateCommentInput,
};
