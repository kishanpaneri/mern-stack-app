const { User } = require("../models");
const { JwtService } = require("../services");
const auth = async (req, res, next) => {
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ status: 401, message: "Unauthorized token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const { _id, email } = await JwtService.verify(token);
    const user = await User.findOne({ _id: _id });
    if (user) {
      req.user = user;
      next();
    } else {
      return res.json({ status: 401, message: "Unauthorized request." });
    }
  } catch (err) {
    if (err?.name === "TokenExpiredError") {
      return res.json({ status: 500, message: "TokenExpiredError" });
    } else {
      return res.json({
        status: 500,
        message: "Server error",
        serverError: err,
      });
    }
  }
};
module.exports = auth;
