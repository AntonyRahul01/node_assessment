const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { body } = require("express-validator");
const { validateRequest } = require("../middlewares/validators");
const ctrl = require("../controllers/memberController");
const { permit } = require("../middlewares/role");

router.post(
  "/:accountId/members",
  auth,
  permit("Admin"),
  body("email").isEmail(),
  validateRequest,
  ctrl.inviteMember
);
router.get("/:accountId/members", auth, ctrl.listMembers);

module.exports = router;
