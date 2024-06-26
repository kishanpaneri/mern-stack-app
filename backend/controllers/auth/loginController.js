const { User, RefreshToken } = require("../../models");
const { REFRESH_SECRET } = require("../../config");
const bcrypt = require("bcrypt");
const { JwtService } = require("../../services");
const loginController = {
  async login(req, res, next) {
    let user;
    try {
      const { email, password } = req.body;
      user = await User.findOne({
        email,
      });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password!" });
      }

      // token generate
      const access_token = JwtService.sign({
        _id: user._id,
        email: user.email,
      });

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
      res.json({ access_token, refresh_token });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal server error.!", serverError: error });
    }
  },
};

module.exports = loginController;
