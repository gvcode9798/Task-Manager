const express = require("express");
const Task = require("./model/task");
const User = require("./model/user");
const taskRouter = require("./routes/task");
const userRouter = require("./routes/user");
const app = express();
require("./db/mongoose");
const port = process.env.PORT || 4000;
app.use(express.json());
const middleFunc = (req, res, next) => {
  console.log(req.header());
  next();
};

app.use(middleFunc);
// user routes
app.use(userRouter);
// task routes
app.use(taskRouter);
app.listen(port, () => {
  console.log("Port is running on ", port);
});
