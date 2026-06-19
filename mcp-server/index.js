console.log("Ecommerce MCP Server Started");

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "ecommerce-mcp",
  version: "1.0.0",
});

server.tool(
  "search_products",
  "Search products from the ecommerce store",
  {
    query: z.string(),
  },
  async ({ query }) => {
    const response = await fetch(
      "https://mern-ecommerce-mcp.onrender.com/api/products",
    );

    const products = await response.json();

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()),
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(filtered, null, 2),
        },
      ],
    };
  },
);

const transport = new StdioServerTransport();

await server.connect(transport);
