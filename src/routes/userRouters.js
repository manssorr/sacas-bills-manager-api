const express = require("express");
const userController = require("../controllers/user.controllers");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();




router.put("/editUser", requireAuth, userController.editUser);
router.post("/addFriend", requireAuth, userController.addFriendByNum);
router.post("/userByNum", requireAuth, userController.byNum);
router.post("/userById", requireAuth, userController.byId);
router.get("/getAllUsers", requireAuth, userController.getAllUsers);
router.post("/rateUsers", requireAuth, userController.rateUsers);

module.exports = router;
