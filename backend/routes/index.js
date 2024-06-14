const express = require("express");
const {
  registerController,
  categoryController,
  productController,
} = require("../controllers");
const { uploadCategoryThumbnail, categoryValidation } = require("../services");

const router = express.Router();

router.get("/user", registerController.register);

router.get("/category", categoryController.index);
router.post("/category",  uploadCategoryThumbnail,  categoryValidation, categoryController.store);
router.put("/category/:id", categoryController.update);
router.delete("/category/:id", categoryController.delete);
router.get("/category/:id", categoryController.getSingle);

router.get("/product", productController.index);
router.post("/product", productController.store);

module.exports = router;
