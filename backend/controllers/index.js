const registerController = require("./auth/registerController");
const loginController = require("./auth/loginController");
const refreshController = require("./auth/refreshController");


const categoryController = require("./categoryController");
const productController = require('./productController')


module.exports = { registerController, categoryController, productController, loginController , refreshController};
