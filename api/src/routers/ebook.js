const express = require("express");
const router = express.Router();
const materiController = require("../controllers/ebook");

router.post("/create", materiController.buatMateri);

router.get("/get/:id", materiController.getOneMateri);

router.get("/getall", materiController.getAllMateri);

router.put("/update/:id", materiController.updateMateri);

router.delete("/delete/:id", materiController.hapusMateri);

router.post("/toggle-simpan/:id", materiController.toggleSimpanMateri);

router.get("/saved/:id", materiController.getSavedMateri);

module.exports = router;
