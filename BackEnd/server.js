const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/api/inventory", require("./routes/inventory.routes"));

app.listen(5000, () => console.log("Server running on 5000"));
