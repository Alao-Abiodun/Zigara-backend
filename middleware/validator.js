const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const response = require("../utils/libs/response");
dotenv.config();

const validateAuth = (req, res, next) => {
  const token = req.get("Authorization");
  if (token) {
    jwt.verify(
      token.split(" ")[1],
      `${process.env.ZIGARA_ACCESS_TOKEN_SECRET}`,
      async (err, decoded) => {
        if (err) {
          return false;
        } else {
          // console.log(decoded)
          req.user = decoded;
          next();
        }
      }
    );
  } else {
    return response.errorResMsg(res, 400, { message: "Authorization failed" });
  }
};

module.exports = {
  validateAuth,
};
