const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/inventoryDB')
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

module.exports = mongoose;
