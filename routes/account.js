const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { permit } = require("../middlewares/role");
const { body } = require("express-validator");
const { validateRequest } = require("../middlewares/validators");
const ctrl = require("../controllers/accountController");

router.post(
  "/",
  auth,
  body("account_name").notEmpty(),
  validateRequest,
  ctrl.createAccount
);
router.get("/", auth, ctrl.listAccounts);
router.get("/:id", auth, ctrl.getAccount);
router.put("/:id", auth, permit("Admin"), ctrl.updateAccount);
router.delete("/:id", auth, permit("Admin"), ctrl.deleteAccount);

module.exports = router;
