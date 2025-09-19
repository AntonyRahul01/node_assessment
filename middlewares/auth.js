const jwtUtil = require("../utils/jwt");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
  const header = req.headers["authorization"];
  if (!header)
    return res.status(401).json({ success: false, message: "Unauthorized" });
  const token = header.split(" ")[1];
  try {
    const payload = jwtUtil.verify(token);
    const user = await User.findById(payload.id);
    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized", error: err.message });
  }
}

module.exports = authMiddleware;
