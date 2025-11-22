const router = require("express").Router();
const inv = require("../controllers/inventory.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Bulk Upload
router.post("/bulk-upload", upload.single("file"), inv.bulkUpload);
router.get("/bulk-status/:uploadId", inv.bulkStatus);

// Reservation Flow
router.post("/reserve", inv.reserveStock);
router.post("/confirm", inv.confirmStock);
router.post("/release", inv.releaseStock);

// Availability
router.get("/:productId/availability", inv.getAvailability);
router.get("/", inv.getAllProducts);
router.delete("/:productId", inv.deleteProduct);


module.exports = router;
