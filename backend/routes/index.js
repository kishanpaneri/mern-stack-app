const express = require("express");
const {
  registerController,
  categoryController,
  productController,
  loginController,
  refreshController,
} = require("../controllers");
const { uploadCategoryThumbnail, categoryValidation } = require("../services");
const { auth } = require("../middleware");
const { uploadProduct, updateUploadProduct } = require("../services/uploads");

const router = express.Router();

router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.post("/refresh", refreshController.refresh);
router.get("/verify", auth, loginController.verifyToken);

router.get("/category", categoryController.index);
router.post(
  "/category",
  uploadCategoryThumbnail,
  categoryValidation,
  categoryController.store
);
router.post(
  "/category/update/:id",
  uploadCategoryThumbnail,
  categoryValidation,
  categoryController.update
);
router.delete("/category/:id", categoryController.delete);
router.get("/category/:id", categoryController.getSingle);
router.get(
  "/category-with-product-count",
  categoryController.categoryWithProductsCount
);

router.get("/products", productController.index);
router.get("/product-by-category/:id", productController.getProductsByCategory);
router.post("/product", productController.store);
router.post("/product/update/:id", updateUploadProduct, productController.update);

router.get("/product/search", productController.search);
router.get("/product/filter", productController.filterProducts);

module.exports = router;
