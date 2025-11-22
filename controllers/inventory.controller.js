const BulkUpload = require("../models/bulkUpload.model");
const Product = require("../models/product.model");
const Reservation = require("../models/reservation.model");
const { processBulkFile } = require("../services/bulkUpload.service");


// =====================================
// 1) BULK UPLOAD
// =====================================
exports.bulkUpload = async (req, res) => {
  try {
    const uploadId = Date.now().toString();

    // Create bulk upload record
    const record = await BulkUpload.create({
      uploadId,
      total: 0,
      processed: 0,
      failed: 0,
      status: "in-progress"
    });

    // Start async processing
    processBulkFile(req.file.path, record._id);

    res.json({ uploadId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// =====================================
// 2) BULK STATUS
// =====================================
exports.bulkStatus = async (req, res) => {
  try {
    const status = await BulkUpload.findOne({ uploadId: req.params.uploadId });
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// =====================================
// 3) RESERVE STOCK (Atomic Update)
// =====================================
exports.reserveStock = async (req, res) => {
  const { userId, productId, qty } = req.body;

  try {
    // Step 1: Atomic deduction of stock
    const product = await Product.findOneAndUpdate(
      {
        _id: productId,
        availableStock: { $gte: qty }
      },
      {
        $inc: { availableStock: -qty, reservedStock: qty }
      },
      { new: true }
    );

    if (!product) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    // Step 2: Create reservation
    const reservation = await Reservation.create({
      userId,
      productId,
      qty,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 min expiry
    });

    res.json({
      message: "Stock reserved successfully",
      reservationId: reservation._id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// =====================================
// 4) CONFIRM STOCK (Payment Successful)
// =====================================
exports.confirmStock = async (req, res) => {
  const { reservationId } = req.body;

  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    if (reservation.status !== "reserved") {
      return res.status(400).json({ message: "Reservation already processed" });
    }

    reservation.status = "confirmed";
    await reservation.save();

    res.json({ message: "Order confirmed successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// =====================================
// 5) RELEASE STOCK (Payment failed / expired)
// =====================================
exports.releaseStock = async (req, res) => {
  const { reservationId } = req.body;

  try {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    if (reservation.status !== "reserved") {
      return res.status(400).json({ message: "Reservation already processed" });
    }

    // Step 1: Add reserved qty back to available stock
    await Product.findOneAndUpdate(
      { _id: reservation.productId },
      {
        $inc: {
          availableStock: reservation.qty,
          reservedStock: -reservation.qty
        }
      }
    );

    // Step 2: Update reservation status
    reservation.status = "released";
    await reservation.save();

    res.json({ message: "Stock released successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// =====================================
// 6) GET PRODUCT AVAILABILITY
// =====================================
exports.getAvailability = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      name: product.name,
      availableStock: product.availableStock,
      reservedStock: product.reservedStock
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }



};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


