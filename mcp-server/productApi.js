const API_BASE_URL =
  process.env.ECOMMERCE_API_BASE_URL || 'https://mern-ecommerce-mcp.onrender.com';

const normalizeBaseUrl = (url) => url.replace(/\/$/, '');

const getJson = async (path) => {
  const response = await fetch(`${normalizeBaseUrl(API_BASE_URL)}${path}`);

  if (!response.ok) {
    throw new Error(`Product API request failed with status ${response.status}`);
  }

  return response.json();
};

const escapeString = (value) => String(value).trim().toLowerCase();

export const getProducts = () => getJson('/api/products');

export const searchProducts = async (query) => {
  const searchTerm = escapeString(query);
  const products = await getProducts();

  return products.filter((product) =>
    escapeString(product.name).includes(searchTerm)
  );
};

export const productsUnderPrice = async (maxPrice) => {
  const priceLimit = Number(maxPrice);
  const products = await getProducts();

  return products
    .filter((product) => Number(product.price) <= priceLimit)
    .sort((a, b) => Number(a.price) - Number(b.price));
};

export const productsByCategory = async (category) => {
  const categoryTerm = escapeString(category);
  const products = await getProducts();

  return products
    .filter((product) => escapeString(product.category).includes(categoryTerm))
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const inStockProducts = async () => {
  const products = await getProducts();

  return products
    .filter((product) => Number(product.countInStock) > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const getProductDetails = (productId) =>
  getJson(`/api/products/${encodeURIComponent(productId)}`);

export const topRatedProducts = async () => {
  const products = await getProducts();

  return products.sort(
    (a, b) =>
      Number(b.rating) - Number(a.rating) ||
      Number(b.numReviews) - Number(a.numReviews)
  );
};
