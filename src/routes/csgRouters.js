const express = require("express");
const csgController = require("../controllers/csg.controllers");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.post("/addNew", requireAuth, csgController.addNewCsg);
router.post("/pay/", requireAuth, csgController.payMonthlyShare);
router.post("/end/", requireAuth, csgController.endCsg);
router.post("/endCycle/", requireAuth, csgController.endCycle);
router.get("/:id", requireAuth, csgController.csgById);
router.post("/rate/", requireAuth, csgController.rating);

module.exports = router;
