const { apiRequest, validatePostInput } = require("../api");

function asTextResult(data) {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
  };
}

function registerPostTools(server, z, validCategories) {
  server.registerTool(
    "create_post",
    {
      description:
        "Create a new post. Validates: title (min 5), author (min 3), category (tech|finance|lifestyle), body (min 50 chars).",
      inputSchema: {
        title: z.string().min(5).describe("Post title, min 5 characters"),
        author: z.string().min(3).describe("Author name, min 3 characters"),
        category: z.enum(validCategories).describe("Category"),
        body: z.string().min(50).describe("Post body, min 50 characters"),
      },
    },
    async (args) => {
      const error = validatePostInput(args);
      if (error) {
        throw new Error(error);
      }

      const post = await apiRequest("POST", "/posts", {
        title: args.title.trim(),
        author: args.author.trim(),
        category: args.category,
        body: args.body.trim(),
      });

      return asTextResult(post);
    }
  );

  server.registerTool(
    "list_posts",
    {
      description: "List all posts from the API.",
      inputSchema: {},
    },
    async () => asTextResult(await apiRequest("GET", "/posts"))
  );

  server.registerTool(
    "get_post",
    {
      description: "Get a single post by ID. Returns 404 if not found.",
      inputSchema: {
        postId: z.string().describe("MongoDB ObjectId of the post"),
      },
    },
    async (args) => asTextResult(await apiRequest("GET", `/posts/${args.postId}`))
  );

  server.registerTool(
    "update_post",
    {
      description:
        "Update an existing post. Same validation as create_post. Returns 404 if post not found.",
      inputSchema: {
        postId: z.string().describe("MongoDB ObjectId of the post"),
        title: z.string().min(5).describe("Post title, min 5 characters"),
        author: z.string().min(3).describe("Author name, min 3 characters"),
        category: z.enum(validCategories).describe("Category"),
        body: z.string().min(50).describe("Post body, min 50 characters"),
      },
    },
    async (args) => {
      const error = validatePostInput(args);
      if (error) {
        throw new Error(error);
      }

      const post = await apiRequest("PUT", `/posts/${args.postId}`, {
        title: args.title.trim(),
        author: args.author.trim(),
        category: args.category,
        body: args.body.trim(),
      });

      return asTextResult(post);
    }
  );

  server.registerTool(
    "delete_post",
    {
      description:
        "Delete a post by ID. Also deletes its comments. Returns 404 if post not found.",
      inputSchema: {
        postId: z.string().describe("MongoDB ObjectId of the post"),
      },
    },
    async (args) =>
      asTextResult(await apiRequest("DELETE", `/posts/${args.postId}`))
  );
}

function registerPostsGuide(server) {
  server.registerResource(
    "posts-api-guide",
    "https://posts-api.example/guide",
    {
      title: "Posts API Guide",
      description:
        "Guide for creating and managing posts. Categories: tech, finance, lifestyle. Title min 5 chars, author min 3, body min 50.",
      mimeType: "text/plain",
    },
    async () => ({
      contents: [
        {
          uri: "https://posts-api.example/guide",
          text: "Posts API: create_post (title, author, category, body), get_post(postId), update_post(postId, ...), delete_post(postId), list_posts. Categories: tech, finance, lifestyle.",
        },
      ],
    })
  );
}

module.exports = {
  registerPostTools,
  registerPostsGuide,
};
