

const axios = require("axios");


const PRODUCT_ID = "6921d45cc3b9229ad7f2dba4";

const CONCURRENT_REQUESTS = 50;

const QTY_PER_REQUEST = 1;

const BASE_URL = "http://localhost:5000/api/inventory";

async function run() {
  if (!PRODUCT_ID === "6921d45cc3b9229ad7f2dba4") {
    console.error("❌ Please set PRODUCT_ID in testConcurrency.js before running this script.");
    process.exit(1);
  }

  console.log(`🚀 Starting concurrency test:
  - Product ID: ${PRODUCT_ID}
  - Requests:   ${CONCURRENT_REQUESTS}
  - Qty each:   ${QTY_PER_REQUEST}
  `);

  const promises = [];
  for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
    promises.push(
      axios
        .post(`${BASE_URL}/reserve`, {
          productId: PRODUCT_ID,
          qty: QTY_PER_REQUEST,
        })
        .then((res) => ({
          ok: true,
          data: res.data,
        }))
        .catch((err) => ({
          ok: false,
          error: err.response?.data || err.message,
        }))
    );
  }

  const results = await Promise.all(promises);

  let successCount = 0;
  let failCount = 0;

  console.log("=== Individual responses (trimmed) ===");
  results.forEach((r, i) => {
    if (r.ok) {
      successCount++;
      console.log(`#${i + 1} ✅`, r.data);
    } else {
      failCount++;
      console.log(`#${i + 1} ❌`, r.error);
    }
  });

  console.log("\n=== Summary ===");
  console.log("✅ Success:", successCount);
  console.log("❌ Failed :", failCount);
  console.log("Total     :", results.length);

  console.log(`
📌 Interpretation:
- If your availableStock was N before this test,
  you should have at most N successful reservations.
- Failed responses should be proper errors like "OUT_OF_STOCK" or similar,
  not crashes or 500 errors.
`);
}

run().catch((e) => {
  console.error("Unexpected error in test script:", e);
});
