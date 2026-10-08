const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isAuthenticated } = require('../middleware/auth');

// GET cart page - requires auth with redirect
router.get('/', isAuthenticated, cartController.getCart);

// AJAX endpoints - handle auth in controller (returns JSON)
router.post('/add', cartController.addToCart);
router.post('/update', cartController.updateCart);
router.post('/remove', cartController.removeFromCart);

module.exports = router;
