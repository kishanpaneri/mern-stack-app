const mongoose = require("mongoose");
const { BASE_URL } = require("../config");

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    title: { type: String, require: true },
    description: { type: String, require: true },
    thumbnail: {
      type: String,
      get: (thumbnail) => {
        return `${BASE_URL}/${thumbnail}`
      },
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);


const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
