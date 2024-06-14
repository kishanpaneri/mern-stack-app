const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    title: { type: String, require: true },
    price: { type: Number, require: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
