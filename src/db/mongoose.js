const mongoose = require("mongoose");
const { uri } = require("./config");
module.exports = mongoose.connect(
  uri,
  {
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => {
    console.log("Connected to data base");
  }
);
