const { body } = require("express-validator");

const categoryValidation = [
  body("title", "Title does not empty.").not().isEmpty(),
  body("description", "Description does not empty.").not().isEmpty(),

];

module.exports = { categoryValidation };
``