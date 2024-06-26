const { Product } = require("../models");

const productController = {
  async index(req, res, next) {
    let products;
    try {
      // products = await Product.find().populate({
      //    path:"categoryId", select: ['title', 'description']
      // });
      products = await Product.find().populate("category");
      // products = await Product.aggregate({});
    } catch (error) {
      return res.status(404).json({ error: "Internal Server error" });
    }
    return res.json({ status: 200, products });
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

  async getProductsByCategory(req, res, next) {
    let cat;
    try {
      const id = req.params.id;
      cat = await Product.find({ categoryId: id }).populate("categoryId");
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal server error.", serverError: error });
    }
    res.status(200).json(cat);
  },
  async search(req, res) {
    let products = [];
    try {
      const searchText = req.query.search;
      products = await Product.find({
        title: { $regex: searchText, $options: "i" }, // i makes it case insensitive
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal server error.", serverError: error });
    }
    res.status(200).json({ products: products });
  },

  async filterProducts(req, res) {
    let products = [];
    try {
      const { search, minPrice, maxPrice, category } = req.query;
      let filter = {};
      if (search) {
        filter.title = { $regex: search, $options: "i" }; // i make it case-insensitive
      }
      if (minPrice) {
        filter.price = { ...filter.price, $gte: minPrice };
      }
      if (maxPrice) {
        filter.price = { ...filter.price, $lte: maxPrice };
      }
      if (category) {
        filter.category = category;
      }
      console.log(filter, "filter");
      products = await Product.find(filter);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal server error.", serverError: error });
    }
    res.status(200).json({ products: products });
  },
};

module.exports = productController;
