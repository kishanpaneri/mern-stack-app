const multer = require("multer");
const path = require("path");
const storageCategory = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/category/thumbnail");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const uploadCategoryMulter = multer({ storageCategory });

const uploadCategoryThumbnail = uploadCategoryMulter.single("thumbnail");

const storageProduct = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "thumbnail") {
      cb(null, "uploads/product/thumbnail/");
    } else {
      cb(null, "uploads/product/slider/");
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const uploadProductMulter = multer({ storage: storageProduct });

const uploadProduct = uploadProductMulter.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "sliders", maxCount: 2 },
]);

const updateUploadProduct = uploadProductMulter.fields([
  { name: "thumbnail" },
  { name: "sliders" },
]);

module.exports = {
  uploadCategoryThumbnail,
  uploadProduct,
  updateUploadProduct,
};
