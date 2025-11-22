const mongoose = require("../database");

const reservationSchema = new mongoose.Schema({
  userId: String,
  productId: mongoose.Schema.Types.ObjectId,
  qty: Number,
  status: { type: String, default: "reserved" },
  expiresAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Reservation", reservationSchema);
