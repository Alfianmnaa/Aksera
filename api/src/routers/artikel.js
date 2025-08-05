const express = require("express");
const router = express.Router();
const artikelController = require("../controllers/artikel");

router.post("/create", artikelController.buatArtikel);
router.get("/get/:id", artikelController.getOneArtikel);
router.get("/getall", artikelController.getAllArtikel);
router.put("/update/:id", artikelController.updateArtikel);
router.delete("/delete/:id", artikelController.hapusArtikel);

module.exports = router;
