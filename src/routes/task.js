const express = require("express");
const router = new express.Router();
const Task = require("../model/task");
router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(`task created ${task}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.get("/tasks", async (req, res) => {
  try {
    console.log("i am called");
    const task = await Task.find({});
    console.log(task);
    res.send(task);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send("No task found");
    }
    res.send(task);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
router.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body);
    if (!task) {
      res.status(404).send("No task found with is id");
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404).send("No task found with is id");
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
module.exports = router;
