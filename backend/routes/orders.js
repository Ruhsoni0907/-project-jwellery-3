const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { shipping } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let subtotal = 0;
    const orderItems = cart.items.map(item => {
      const itemTotal = item.productId.price * item.quantity;
      subtotal += itemTotal;
      return {
        productId: item.productId._id,
        name: item.productId.name,
        image: item.productId.images[0] || '',
        quantity: item.quantity,
        price: item.productId.price,
        options: item.options
      };
    });

    const shippingCost = subtotal >= 500 ? 0 : 29.99;
    const total = subtotal + shippingCost;

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      shipping,
      subtotal,
      shippingCost,
      total,
      status: 'pending'
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart
    await Cart.findOneAndDelete({ userId: req.user._id });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
