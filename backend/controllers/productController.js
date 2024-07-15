const multer = require("multer");
const { Product } = require("../models");
const { uploadProduct } = require("../services/uploads");

const productController = {
  async index(req, res, next) {
    let products;
    try {
      // products = await Product.find().populate({
      //    path:"category", select: ['title', 'description']
      // });
      // products = await Product.find().populate("category");
      products = await Product.find();
      // products = await Product.aggregate([
      //   {
      //     $lookup: {
      //       from: "categories",
      //       localField: "category",
      //       foreignField: "_id",
      //       as: "cat",
      //     },
      //   },
      // ]);
    } catch (error) {
      console.log(error);
      return res
        .status(404)
        .json({ error: "Internal Server error", serverError: error });
    }
    return res.json({ status: 200, products });
  },

  async store(req, res, next) {
    let product = {};
    try {
      uploadProduct(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          // Handle multer-specific errors
          if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
              error: "Too many files to upload. Maximum limit exceeded.",
            });
          } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res
              .status(400)
              .json({ error: "Unexpected field encountered." });
          }
          return res.status(400).json({ error: err.message });
        } else if (err) {
          // Handle other errors
          return res.status(500).json({ error: err.message });
        }
        const sliderFiles = req.files["sliders"] || [];
        // const sliderFileNames = sliderFiles
        //   .map((file) =>  "uploads/product/sliders/" + file.filename)
        //   .join(", ");

        const sliderFileNames = sliderFiles.map(
          (file) => "uploads/product/sliders/" + file.filename
        );

        const { title, price, category } = req.body;
        product = await Product.create({
          title,
          price,
          category,
          thumbnail:
            "uploads/product/thumbnail/" + req.files["thumbnail"][0].filename,
          slider: sliderFileNames,
        });
        return res.json({ status: 201, product });
      });
    } catch (error) {
      return res.json({
        status: 404,
        error: "Internal server error.",
        serverError: error,
      });
    }
  },

  async update(req, res, next) {
    let product;
    try {
      const id = req.params.id;
      // const { category, title, price } = req.body;
      console.log(req.body, req.files, id);
      // product = await Product.find({ categoryId: id }).populate("categoryId");
      const { title, price, category } = req.body;
      let updateData = { title, price, category };
      if (req?.files) {
        const thumbnailFiles = req.files["thumbnail"] || [];
        if (thumbnailFiles.length > 0) {
          updateData.thumbnail =
            "uploads/category/thumbnail/" + thumbnailFiles[0].filename;
        }
        const sliderFiles = req.files["sliders"] || [];
        if (sliderFiles.length > 0) {
          const sliderFileNames = sliderFiles.map(
            (file) => "uploads/product/sliders/" + file.filename
          );
          console.log(sliderFileNames);
          updateData.sliders = sliderFileNames;
        }
      }
      product = await Product.findOneAndUpdate({ _id: id }, updateData, {
        new: true,
      });
    } catch (error) {
      console.log(error);
      return res.json({
        status: 500,
        error: "Internal server error.",
        serverError: error,
      });
    }
    res.json({ status: 200, product });
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
      const { search, minPrice, maxPrice, category, categories } = req.query;
      let filter = {};
      let orFilter = [];
      if (search) {
        filter.title = { $regex: search, $options: "i" }; // i make it case-insensitive
      }
      if (minPrice) {
        filter.price = { ...filter.price, $gte: minPrice };
      }
      if (maxPrice) {
        filter.price = { ...filter.price, $lte: maxPrice };
      }
      // if (category) {
      //   filter.category = category;
      // }
      // if (categories) {
      //   const catArr = JSON.parse(categories);
      //   if (catArr && catArr.length > 0) {
      //     for (let i = 0; i < catArr.length; i++) {
      //       orFilter.push({ category: catArr[i] });
      //     }
      //   }
      // }
      // console.log(typeof categories);
      if (categories) {
        filter.category = { $in: JSON.parse(categories) };
      }
      console.log(filter, "filter");
      products = await Product.find(filter);
    } catch (error) {
      console.log(error);
      return res.json({
        status: 500,
        error: "Internal server error.",
        serverError: error,
      });
    }
    res.json({ status: 200, products: products });
  },
};

module.exports = productController;
