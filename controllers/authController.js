const User = require("../models/User");
const Role = require("../models/Role");
const Account = require("../models/Account");
const AccountMember = require("../models/AccountMember");
const jwtUtil = require("../utils/jwt");

async function signup(req, res, next) {
  try {
    const { email, password, fullname } = req.body;
    const user = new User({ email, password });
    await user.save();

    let adminRole = await Role.findOne({ role_name: "Admin" });
    if (!adminRole) adminRole = await Role.create({ role_name: "Admin" });

    const account = new Account({
      account_name: `${email}-default-account`,
      created_by: user._id,
      updated_by: user._id,
    });
    await account.save();

    await AccountMember.create({
      account: account._id,
      user: user._id,
      role: adminRole._id,
      created_by: user._id,
      updated_by: user._id,
    });

    const token = jwtUtil.sign(user);
    return res.json({ success: true, token });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    const match = await user.comparePassword(password);
    if (!match)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    const token = jwtUtil.sign(user);
    return res.json({ success: true, token });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login };
