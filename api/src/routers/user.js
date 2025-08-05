const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/get/:id", userController.getUser);
router.get("/getall", userController.getAllUsers);
router.put("/update/:id", userController.updateUser);
router.delete("/delete/:id", userController.hapusAkun);

module.exports = router;
