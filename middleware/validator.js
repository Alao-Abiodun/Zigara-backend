const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const response = require("../utils/libs/response");

const validateAuth = async (req, res, next) => {
  const token = req.get("Authorization");
  // const token = req.headers.authorization;
  if (token) {
    jwt.verify(
      token.split(" ")[1],
      `${process.env.ZIGARA_ACCESS_TOKEN_SECRET}`,
      async (err, decoded) => {
        console.log(err)
        if (err) {
          return response.errorResMsg(res, 400, { message: err });;
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
