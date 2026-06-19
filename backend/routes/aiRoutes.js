import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

const router = express.Router();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const formatProducts = (products) => {
  if (!products.length) {
    return 'I could not find any matching products right now.';
  }

  const productLines = products.map(
    (product) => `- ${product.name} - Rs. ${product.price}`
  );

  return `Here are some products I found:\n${productLines.join('\n')}`;
};

const cleanSearchTerm = (value) =>
  value
    .replace(/[?.!,]+$/g, '')
    .replace(/\b(please|thanks|thank you)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getNameSearchTerm = (message) =>
  cleanSearchTerm(
    message
      .replace(/\b(show|find|search|products?|items?|me|for)\b/gi, ' ')
  );

router.post(
  '/chat',
  asyncHandler(async (req, res) => {
    const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';

    if (!message) {
      res.status(400);
      throw new Error('Message is required');
    }

    const lowerMessage = message.toLowerCase();
    const priceMatch = lowerMessage.match(
      /\b(?:under|below|less than|cheaper than)\s*(?:rs\.?|\u20b9|\$)?\s*(\d+(?:\.\d+)?)/
    );

    let products = [];

    if (priceMatch) {
      const maxPrice = Number(priceMatch[1]);
      products = await Product.find({ price: { $lte: maxPrice } })
        .select('name price')
        .sort({ price: 1 })
        .limit(10);

      return res.json({ reply: formatProducts(products) });
    }

    const categoryMatch = lowerMessage.match(/\bcategory\s+([a-z0-9\s-]+)/i);

    if (categoryMatch) {
      const category = cleanSearchTerm(categoryMatch[1]);
      products = await Product.find({
        category: { $regex: escapeRegex(category), $options: 'i' },
      })
        .select('name price')
        .sort({ name: 1 })
        .limit(10);

      return res.json({ reply: formatProducts(products) });
    }

    if (/\b(in stock|available|availability)\b/i.test(message)) {
      products = await Product.find({ countInStock: { $gt: 0 } })
        .select('name price')
        .sort({ name: 1 })
        .limit(10);

      return res.json({ reply: formatProducts(products) });
    }

    const searchTerm = getNameSearchTerm(message);

    if (searchTerm) {
      products = await Product.find({
        name: { $regex: escapeRegex(searchTerm), $options: 'i' },
      })
        .select('name price')
        .sort({ name: 1 })
        .limit(10);

      return res.json({ reply: formatProducts(products) });
    }

    return res.json({
      reply:
        'I can help you find products by price, name, category, or stock availability. Try "show products under 500" or "show products in category spices".',
    });
  })
);

export default router;
