import Product from '../models/productModel.js';

const PRODUCT_CARD_FIELDS = 'name price image rating numReviews category countInStock';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const searchProducts = (query) =>
  Product.find({
    name: { $regex: escapeRegex(query), $options: 'i' },
  })
    .select(PRODUCT_CARD_FIELDS)
    .sort({ name: 1 })
    .limit(10);

export const productsUnderPrice = (maxPrice) =>
  Product.find({ price: { $lte: Number(maxPrice) } })
    .select(PRODUCT_CARD_FIELDS)
    .sort({ price: 1 })
    .limit(10);

export const productsByCategory = (category) =>
  Product.find({
    category: { $regex: escapeRegex(category), $options: 'i' },
  })
    .select(PRODUCT_CARD_FIELDS)
    .sort({ name: 1 })
    .limit(10);

export const inStockProducts = () =>
  Product.find({ countInStock: { $gt: 0 } })
    .select(PRODUCT_CARD_FIELDS)
    .sort({ name: 1 })
    .limit(10);

export const getProductDetails = (productId) => Product.findById(productId);

export const topRatedProducts = () =>
  Product.find({})
    .select(PRODUCT_CARD_FIELDS)
    .sort({ rating: -1, numReviews: -1 })
    .limit(10);
