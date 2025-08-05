const express = require("express");
const router = express.Router();
const detilUserController = require("../controllers/detilUser");

router.post("/create", detilUserController.buatDetilUser);
router.get("/get/:id", detilUserController.getDetilUser);
router.put("/update/:id", detilUserController.updateDetilUser);

module.exports = router;
