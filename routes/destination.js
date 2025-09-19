const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { body } = require("express-validator");
const { validateRequest } = require("../middlewares/validators");
const ctrl = require("../controllers/destinationController");

router.post(
  "/:accountId/destinations",
  auth,
  body("url").isURL(),
  body("method").notEmpty(),
  validateRequest,
  ctrl.createDestination
);
router.get("/:accountId/destinations", auth, ctrl.listDestinations);

router.put("/destinations/:id", auth, ctrl.updateDestination);
router.delete("/destinations/:id", auth, ctrl.deleteDestination);

module.exports = router;
