const AccountMember = require("../models/AccountMember");
const Role = require("../models/Role");

function permit(required = "Admin") {
  return async (req, res, next) => {
    try {
      const { accountId } = req.params;
      if (!req.user)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const member = await AccountMember.findOne({
        account: accountId,
        user: req.user._id,
      }).populate("role");

      if (!member)
        return res
          .status(403)
          .json({ success: false, message: "Forbidden: not a member" });

      if (required === "Admin" && member.role.role_name !== "Admin") {
        return res
          .status(403)
          .json({ success: false, message: "Forbidden: admin only" });
      }

      req.member = member;
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { permit };
