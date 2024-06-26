const { User } = require("../../models");
const bcrypt = require('bcrypt');

const registerController = {
  async register(req, res, next) {
    let user;
    try {
      const { fullName, email, mobile, password } = req.body;

      const emailExist = await User.exists({ email: email });
      if (emailExist) {
        return res.status(409).json({ error: "Email already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        fullName,
        email,
        mobile,
        password: hashedPassword,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal server error.", serverError: error });
    }
    return res.status(201).json(user);
  },
};

module.exports = registerController;
