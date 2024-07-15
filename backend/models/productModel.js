const mongoose = require("mongoose");

const { BASE_URL } = require("../config");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    title: { type: String, require: true },
    price: { type: Number, require: true },
    thumbnail: {
      type: String,
      get: (thumbnail) => {
        return `${BASE_URL}/${thumbnail}`;
      },
    },
    slider: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
