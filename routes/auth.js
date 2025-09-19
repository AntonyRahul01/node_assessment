const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { validateRequest } = require("../middlewares/validators");
const authController = require("../controllers/authController");

router.post(
  "/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  validateRequest,
  authController.signup
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").exists(),
  validateRequest,
  authController.login
);

module.exports = router;
