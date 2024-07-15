const { User, RefreshToken } = require("../../models");
const { REFRESH_SECRET } = require("../../config");
const bcrypt = require("bcrypt");
const { JwtService } = require("../../services");
const loginController = {
  async login(req, res, next) {
    let user;
    try {
      const { email, password } = req.body;
      console.log(email, password, "data");
      user = await User.findOne({
        email,
      });
      if (!user) {
        return res.json({ status: 401, message: "Invalid email" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.json({ status: 401, message: "Invalid email or password!" });
      }

      // token generate
      const access_token = JwtService.sign({
        _id: user._id,
        email: user.email,
      }, '30m');

      const refresh_token = JwtService.sign(
        {
          _id: user._id,
          email: user.email,
        },
        "1y",
        REFRESH_SECRET
      );
      await RefreshToken.deleteMany({ user: user._id });
      await RefreshToken.create({ user: user._id, token: refresh_token });
      res.json({ status: 200, access_token, refresh_token });
    } catch (error) {
      return res.json({
        status: 500,
        error: "Internal server error.!",
        serverError: error,
      });
    }
  },

  async verifyToken(req, res){
    try {
      res.json({ status: 200, user: req.user });
    } catch (error) {
      console.log(error)
      return res.json({
        status: 500,
        error: "Internal server error.!",
        serverError: error,
      });
    }
  }
};

module.exports = loginController;
