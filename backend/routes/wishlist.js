const express = require('express');
const Wishlist = require('../models/Wishlist');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user._id }).populate('productId');
    res.json(wishlist.map(w => w.productId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:productId', isAuthenticated, async (req, res) => {
  try {
    const { productId } = req.params;

    const existing = await Wishlist.findOne({ userId: req.user._id, productId });

    if (existing) {
      await existing.deleteOne();
      res.json({ added: false, message: 'Removed from wishlist' });
    } else {
      await Wishlist.create({ userId: req.user._id, productId });
      res.json({ added: true, message: 'Added to wishlist' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/check/:productId', isAuthenticated, async (req, res) => {
  try {
    const exists = await Wishlist.findOne({ userId: req.user._id, productId: req.params.productId });
    res.json({ inWishlist: !!exists });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
