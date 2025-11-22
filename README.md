🚀 MEAN Stack Inventory Management System

A complete Inventory Management System built using the MEAN Stack (MongoDB, Express, Angular, Node.js) with support for:

✔ Bulk CSV Upload
✔ Background Processing with Live Status
✔ Stock Availability
✔ Reservation → Confirmation → Release Workflow
✔ Full Inventory Listing
✔ Clean Angular UI
✔ A dedicated concurrency testing script (`testConcurrency.js`) has been included in the Backend directory to simulate multiple parallel reservation requests and verify system stability under race conditions.

📌 Table of Contents

📌 Features

🛠 Tech Stack

📂 Project Structure

⚙️ Backend API Documentation

💻 Frontend Pages

📦 Sample CSV Format

🚀 Installation & Setup

🔬 Concurrency Test Script

📸 Screenshots (Add Yours)

📘 Conclusion

📌 Features
🟦 Bulk Upload

Upload CSV file

Background processing

Progress tracking via polling

🟩 Inventory Management

View all products

View product availability

Stock color indicator (low/high stock)

🟧 Reservation Workflow

Reserve stock

Confirm reservation
Release reservation
🎨 Clean Angular UI
Modular components
Reusable service layer
Routing for all pages
🛠 Tech Stack
Frontend
Angular 15+
TypeScript
HTML / CSS
Backend
Node.js
Express.js
MongoDB + Mongoose
Multer (CSV upload)



MEAN-Stack-task/
│── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
│
│── FrontEnd/
│   ├── src/app/components/
│   ├── src/app/services/
│   ├── src/app/app-routing.module.ts
│   └── src/app/app.module.ts
│
└── README.md

⚙️ Backend API Documentation
📥 1. Bulk Upload
POST /api/inventory/bulk-upload

Uploads CSV → Processes rows → Updates DB.

GET /api/inventory/bulk-status/:uploadId
{
  "uploadId": "17638136...",
  "total": 8,
  "processed": 8,
  "failed": 0,
  "status": "COMPLETED"
}
📦 2. Inventory APIs
GET /api/inventory

Returns full inventory list.

GET /api/inventory/:productId/availability

Returns:
{
  "productId": "123",
  "available": 10,
  "reserved": 3
}
🔁 3. Reservation APIs
POST /api/inventory/reserve
Input:

{
  "productId": "123",
  "qty": 5
}


Output:

{
  "reservationId": "6921abcd1234..."
}

POST /api/inventory/confirm

Input:

{
  "reservationId": "6921abcd1234..."
}


Output:

Order confirmed successfully

POST /api/inventory/release

Input:

{
  "reservationId": "6921abcd1234..."
}

💻 Frontend Pages
Page	Description
Bulk Upload	Upload CSV, track progress
Bulk Status	Polling until COMPLETED
Availability	Check stock for product
Stocks List	View all products with color indicators
Reserve	Reserve stock → returns reservationId
Confirm	Confirm reservation via reservationId
Release	Release reservation (if implemented)
📦 Sample CSV Format
name,availableStock,reservedStock
iPhone,10,5
Samsung,20,3
Dell Mouse,30,1
HP Keyboard,5,1

🚀 Installation & Setup
1️⃣ Backend Setup
cd Backend
npm install
node server.js
# or
nodemon server.js


Backend runs at:

http://localhost:5000/

2️⃣ Frontend Setup
cd FrontEnd
npm install
ng serve


Frontend runs at:

http://localhost:4200/

🔬 Concurrency Test Script

Create a file testConcurrency.js:

const axios = require("axios");

const productId = "YOUR_PRODUCT_ID";
const qty = 1;

for (let i = 0; i < 50; i++) {
  axios.post("http://localhost:5000/api/inventory/reserve", {
    productId,
    qty
  })
  .then(res => console.log("OK", res.data))
  .catch(err => console.log("ERR", err.response.data));
}


Run it:

node testConcurrency.js


This simulates 50 simultaneous reserve calls.
