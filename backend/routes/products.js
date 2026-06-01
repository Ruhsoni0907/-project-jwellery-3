const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { category, metal, gemstone, priceMax, search, sort, page = 1, limit = 50 } = req.query;
    let filter = {};

    if (category) {
      filter.category = { $in: category.split(',') };
    }
    if (metal) {
      filter.metal = { $in: metal.split(',') };
    }
    if (gemstone) {
      filter.gemstone = { $in: gemstone.split(',') };
    }
    if (priceMax) {
      filter.price = { $lte: parseFloat(priceMax) };
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortObj = {};
    switch (sort) {
      case 'price-low': sortObj = { price: 1 }; break;
      case 'price-high': sortObj = { price: -1 }; break;
      case 'rating': sortObj = { rating: -1 }; break;
      case 'newest': sortObj = { createdAt: -1 }; break;
      default: sortObj = { featured: -1, createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Product.countDocuments(filter);

    res.json({ products, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
