const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { isAuthenticated } = require("../middleware/auth");

router.get("/checkout", isAuthenticated, orderController.getCheckout);
router.post("/checkout", isAuthenticated, orderController.postCheckout);
router.get("/", isAuthenticated, orderController.getOrders);
router.get("/:id/success", isAuthenticated, orderController.getOrderSuccess);
router.get("/:id", isAuthenticated, orderController.getOrderDetail);
router.post("/:id/cancel", isAuthenticated, orderController.cancelOrder);

module.exports = router;
