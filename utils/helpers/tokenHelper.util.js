const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../configs/server.config");

const createToken = (id) => {
  try {
    const token = jwt.sign({userId: id }, JWT_SECRET, { expiresIn: "30d" });
    return token;
  } catch (error) {
    log.error("Error from [Token HELPER]:", error);
    throw error;
  }
};

const verifyToken = (token) => {
  try {
    const decode = jwt.verify(token, JWT_SECRET);
    return decode;
  } catch (error) {
    log.error("Error from [Token HELPER]: ", error);
    throw error;
  }
};

module.exports = { createToken, verifyToken };
