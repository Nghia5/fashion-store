const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/suggest', productController.searchSuggest);
router.get('/', productController.getProducts);
router.post('/review', isAuthenticated, productController.addReview);
router.get('/:slug', productController.getProduct);

module.exports = router;

