const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
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

const uploadMulter = multer({ storage });

const uploadCategoryThumbnail = uploadMulter.single("thumbnail");

module.exports = { uploadCategoryThumbnail };
