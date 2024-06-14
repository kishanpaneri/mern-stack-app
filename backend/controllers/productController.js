const { Product } = require("../models");

const productController = {
  async index(req, res, next) {
    let products;
    try {
      products = await Product.find().populate('category');
    } catch (error) {
      return res.status(404).json({ error: 'Internal Server error' });
    }
    return res.json(products);
  },

  async store(req, res, next) {
    let cat;
    try {
      const { title, price, category } = req.body;
      cat = await Product.create({
        title,
        price,
        category,
      });
    } catch (error) {
      return res
        .status(404)
        .json({ error: "Internal server error.", serverError: error });
    }
    res.status(201).json(cat);
  },
};

module.exports = productController;
