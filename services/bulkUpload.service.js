const fs = require("fs");
const BulkUpload = require("../models/bulkUpload.model");
const Product = require("../models/product.model");

exports.processBulkFile = async (filePath, bulkId) => {
  const bulk = await BulkUpload.findById(bulkId);

  const lines = fs.readFileSync(filePath, "utf8").trim().split("\n");
  bulk.total = lines.length;
  await bulk.save();

  for (let line of lines) {
    try {
      // Split by comma
      const cols = line.split(",");

      if (cols.length < 3) {
        bulk.failed++;
        await bulk.save();
        continue;
      }

      const name = cols[0].trim();
      const availableStock = Number(cols[1].trim());
      const reservedStock = Number(cols[2].trim());

      // Update or insert product
      await Product.findOneAndUpdate(
        { name },
        {
          $set: {
            availableStock,
            reservedStock
          }
        },
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
