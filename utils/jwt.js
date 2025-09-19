const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRY = "7d" } = process.env;

function sign(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
}

function verify(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { sign, verify };
