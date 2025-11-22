const fs = require("fs");
const BulkUpload = require("../models/bulkUpload.model");
const Product = require("../models/product.model");

exports.processBulkFile = async (filePath, bulkId) => {
  const bulk = await BulkUpload.findById(bulkId);

  let lines = fs.readFileSync(filePath, "utf8").trim().split("\n");

  // Remove header row
  lines = lines.slice(1);

  bulk.total = lines.length;
  bulk.processed = 0;
  bulk.failed = 0;
  await bulk.save();

  for (let line of lines) {
    try {
      const cols = line.split(",");

      if (cols.length < 3) {
        bulk.failed++;
        continue;
      }

      const name = cols[0].trim();
      const availableStock = Number(cols[1].trim());
      const reservedStock = Number(cols[2].trim());

      if (isNaN(availableStock) || isNaN(reservedStock)) {
        bulk.failed++;
        continue;
      }

      // update product
      await Product.findOneAndUpdate(
        { name },
        { $set: { availableStock, reservedStock } },
        { upsert: true }
      );

      bulk.processed++;
    } catch (err) {
      bulk.failed++;
    }
  }

  // Final status
  bulk.status = "COMPLETED";
  await bulk.save();
};
