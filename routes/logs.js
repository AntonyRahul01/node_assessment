const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { permit } = require("../middlewares/role");
const logsController = require("../controllers/logsController");

router.get("/:accountId/logs", auth, permit("Admin"), logsController.listLogs);

module.exports = router;
