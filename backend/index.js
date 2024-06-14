const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const { APP_PORT, DB_URL } = require("./config");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

mongoose.connect(DB_URL, {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DB connected...");
});

app.use("/api", routes);

app.listen(4001, () => {
  console.log(`run nodejs application ${APP_PORT}`);
});
