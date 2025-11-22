const mongoose = require("../database");

const bulkUploadSchema = new mongoose.Schema({
  uploadId: String,
  total: Number,
  processed: Number,
  failed: Number,
  status: String
});

module.exports = mongoose.model("BulkUpload", bulkUploadSchema);
