const express = require("express");
const router = new express.Router();
const User = require("../model/user");
router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    console.log("this is user ", user);
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).send(`user created ${user}`);
  } catch (error) {
    console.log("Here is error ");
    res.status(400).send(error.message);
  }
});
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(err);
  }
});
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("No user exists");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.put("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "age", "email", "password"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.send("Invalid Update");
  }
  try {
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send("No user found to update");
    }

    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save();
    res.send(`updated user ${user}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send(user);
  } catch (error) {
    res.status(400).send(`${error.message}`);
  }
});
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).send("No user found");
    }
    res.send(`deleted user ${user}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
module.exports = router;
