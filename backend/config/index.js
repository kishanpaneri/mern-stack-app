const dotenv = require("dotenv");

dotenv.config();

module.exports = { APP_PORT, DB_URL, BASE_URL, JWT_SECRET, REFRESH_SECRET } = process.env;
