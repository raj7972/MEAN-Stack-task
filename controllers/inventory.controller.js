const BulkUpload = require("../models/bulkUpload.model");
const Product = require("../models/product.model");
const { processBulkFile } = require("../services/bulkUpload.service");

exports.bulkUpload = async (req, res) => {
  const uploadId = Date.now().toString();

  const record = await BulkUpload.create({
    uploadId,
    total: 0,
    processed: 0,
    failed: 0,
    status: "in-progress"
  });

  processBulkFile(req.file.path, record._id);

  res.json({ uploadId });
};

exports.bulkStatus = async (req, res) => {
  const status = await BulkUpload.findOne({ uploadId: req.params.uploadId });
  res.json(status);
};
