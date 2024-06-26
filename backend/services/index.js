const { uploadCategoryThumbnail } = require("./uploads");
const { categoryValidation } = require("./customValidation");
const JwtService = require("./JwtService");

module.exports = { uploadCategoryThumbnail, categoryValidation, JwtService };
