const express = require("express");
const router = express.Router();
const detilDonasiController = require("../controllers/detilDonasi");

router.get("/getall", detilDonasiController.getAllDetilDonasi);
router.get("/get/:id", detilDonasiController.getDetilDonasi);
router.put("/update/:id", detilDonasiController.updateDetilDonasi);
router.post("/permohonan/:id", detilDonasiController.tambahPermohonan);

module.exports = router;
