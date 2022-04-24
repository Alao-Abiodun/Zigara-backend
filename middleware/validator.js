const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const response = require("../utils/libs/response"); 

const validateAuth = async (req, res, next) => {
  // const token = req.get("Authorization");
  const token = req.headers.authorization.split(' ')[1];
  if (token) {

    jwt.verify(
      token,
      `${process.env.ZIGARA_ACCESS_TOKEN_SECRET}`,
      async (err, decoded) => {
        console.log(err)
        if (err) {
          return false;
        } else {
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
