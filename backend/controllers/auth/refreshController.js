const { RefreshToken, User } = require("../../models");
const { JwtService } = require("../../services");

const refreshController = {
  async refresh(req, res, next) {
    try {
      const refreshToken = await RefreshToken.findOne({
        token: req.body.refresh_token,
      });
      if (!refreshToken) {
        return res.status(401).json("Invalid refresh token");
      }

      let userId;
      const { _id } = await JwtService.verify(
        refreshToken.token,
        REFRESH_SECRET
      );
      userId = _id;

      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(401).json("No user found!");
      }

      // token generate
      const access_token = JwtService.sign({
        _id: user._id,
        role: user.role,
      });

      const refresh_token = JwtService.sign(
        {
          _id: user._id,
          role: user.role,
        },
        "1y",
        REFRESH_SECRET
      );
      // dashboard whitelist
      await RefreshToken.deleteMany({ user: user._id });
      await RefreshToken.create({ token: refresh_token });
      res.json({ access_token, refresh_token });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal server error.!", serverError: error });
    }
  },
};

module.exports = refreshController;
