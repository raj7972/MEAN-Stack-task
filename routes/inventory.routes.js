const router = require("express").Router();
const inv = require("../controllers/inventory.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/bulk-upload", upload.single("file"), inv.bulkUpload);
router.get("/bulk-status/:uploadId", inv.bulkStatus);

module.exports = router;
