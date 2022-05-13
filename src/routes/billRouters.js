const express = require("express");
const billController = require("../controllers/bill.controllers");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.post("/addNew", requireAuth, billController.addNewBill);
router.post("/pay/", requireAuth, billController.payMyPart);
router.post("/end/", requireAuth, billController.endBill);
router.post("/rate/", requireAuth, billController.rating);


module.exports = router;
