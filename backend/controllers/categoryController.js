const { Category } = require("../models");
const { validationResult } = require("express-validator");
const path = require("path");

const categoryController = {
  async index(req, res, next) {
    let categories;
    try {
      categories = await Category.find().sort({ updated_at: "desc" });

    } catch (error) {
      return res.status(500).json({ error: "Internal server error." });
    }
    return res.json({ status: 200, categories });
  },

  async store(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      let cat;
      try {
        const { title, description } = req.body;
        cat = await Category.create({
          title,
          description,
          thumbnail: "uploads/category/thumbnail/" + req.file.filename,
        });
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Internal server error.", serverError: error });
      }
      return res.status(201).json(cat);
    }
    res.status(422).json({ errors: errors.array() });
  },

  async getSingle(req, res, next) {
    let cat;
    try {
      const id = req.params.id;
      cat = await Category.findById({ _id: id });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal server error.", serverError: error });
    }
    res.status(200).json(cat);
  },

  async update(req, res, next) {
    let cat;
    try {
      const id = req.params.id;
      const { title, description } = req.body;
      let updateData = { title, description };
      if (req.file && req.file.filename) {
        updateData.thumbnail =
          "uploads/category/thumbnail/" + req.file.filename;
      }
      cat = await Category.findOneAndUpdate({ _id: id }, updateData, {
        new: true,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal server error.", serverError: error });
    }
    res.status(200).json(cat);
  },

  async delete(req, res, next) {
    let cat;
    try {
      const id = req.params.id;
      cat = await Category.findByIdAndDelete({ _id: id });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal server error.", serverError: error });
    }
    res.status(201).json(cat);
  },
};

module.exports = categoryController;
