const fs = require("fs");
const BulkUpload = require("../models/bulkUpload.model");
const Product = require("../models/product.model");

exports.processBulkFile = async (filePath, bulkId) => {
  const bulk = await BulkUpload.findById(bulkId);

  const lines = fs.readFileSync(filePath).toString().split("\n");
  bulk.total = lines.length;
  await bulk.save();

  for (let line of lines) {
    try {
      const [name, stock] = line.split(",");
      await Product.findOneAndUpdate(
        { name },
        { $set: { availableStock: Number(stock) } },
        { upsert: true }
      );

      bulk.processed++;
    } catch (err) {
      bulk.failed++;
    }

    await bulk.save();
  }

  bulk.status = "completed";
  await bulk.save();
};
