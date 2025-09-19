const express = require("express");
const router = express.Router();
const incomingController = require("../controllers/incomingController");
const rateLimiter = require("../middlewares/rateLimiter");

router.post(
  "/server/incoming_data",
  rateLimiter,
  incomingController.incomingData
);

module.exports = router;
