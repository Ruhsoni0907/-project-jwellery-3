const express = require('express');
const Cart = require('../models/Cart');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.get('/', isAuthenticated, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart) {
      cart = { items: [] };
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { productId, quantity = 1, options = {} } = req.body;

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const optionsKey = JSON.stringify(options);
    const existingIndex = cart.items.findIndex(
      item => item.productId.toString() === productId &&
              JSON.stringify(item.options) === optionsKey
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity;
      if (cart.items[existingIndex].quantity > 10) {
        cart.items[existingIndex].quantity = 10;
      }
    } else {
      cart.items.push({ productId, quantity, options });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:itemId', isAuthenticated, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (quantity <= 0) {
      item.deleteOne();
    } else {
      item.quantity = Math.min(quantity, 10);
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:itemId', isAuthenticated, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
