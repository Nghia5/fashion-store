const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { isAdmin } = require("../middleware/auth");

router.use(isAdmin);

router.get("/", (req, res) => res.redirect("/admin/dashboard"));
router.get("/dashboard", adminController.getDashboard);

router.get("/products", adminController.getProducts);
router.get("/products/new", adminController.getProductForm);
router.post("/products", adminController.upload.array("images", 5), adminController.createProduct);
router.get("/products/:id/edit", adminController.getProductForm);
router.post("/products/:id", adminController.upload.array("images", 5), adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);

router.get("/orders", adminController.getOrders);
router.put("/orders/:id/status", adminController.updateOrderStatus);

router.get("/users", adminController.getUsers);
router.put("/users/:id/toggle", adminController.toggleUser);

router.get("/categories", adminController.getCategories);
router.post("/categories", adminController.createCategory);
router.delete("/categories/:id", adminController.deleteCategory);

router.get("/vouchers", adminController.getVouchers);
router.post("/vouchers", adminController.createVoucher);
router.put("/vouchers/:id/toggle", adminController.toggleVoucher);
router.delete("/vouchers/:id", adminController.deleteVoucher);

module.exports = router;
