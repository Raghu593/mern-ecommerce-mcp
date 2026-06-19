import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  getProductDetails,
  inStockProducts,
  productsByCategory,
  productsUnderPrice,
  searchProducts,
  topRatedProducts,
} from "./productApi.js";

const server = new McpServer({
  name: "ecommerce-mcp",
  version: "1.0.0",
});

const asToolResponse = (data) => ({
  content: [
    {
      type: "text",
      text: JSON.stringify(data, null, 2),
    },
  ],
});

server.tool(
  "search_products",
  "Search ecommerce products by product name",
  {
    query: z.string(),
  },
  async ({ query }) => {
    const products = await searchProducts(query);

    return asToolResponse(products);
  },
);

server.tool(
  "products_under_price",
  "Return ecommerce products priced less than or equal to maxPrice",
  {
    maxPrice: z.number(),
  },
  async ({ maxPrice }) => {
    const products = await productsUnderPrice(maxPrice);

    return asToolResponse(products);
  },
);

server.tool(
  "products_by_category",
  "Return ecommerce products that match a category",
  {
    category: z.string(),
  },
  async ({ category }) => {
    const products = await productsByCategory(category);

    return asToolResponse(products);
  },
);

server.tool(
  "in_stock_products",
  "Return ecommerce products where countInStock is greater than zero",
  {},
  async () => {
    const products = await inStockProducts();

    return asToolResponse(products);
  },
);

server.tool(
  "get_product_details",
  "Return full details for one ecommerce product by product id",
  {
    productId: z.string(),
  },
  async ({ productId }) => {
    const product = await getProductDetails(productId);

    return asToolResponse(product);
  },
);

server.tool(
  "top_rated_products",
  "Return ecommerce products sorted by rating and review count",
  {},
  async () => {
    const products = await topRatedProducts();

    return asToolResponse(products);
  },
);

const transport = new StdioServerTransport();

console.error("Ecommerce MCP Server Started");
await server.connect(transport);
