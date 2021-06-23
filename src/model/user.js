const mongoose = require("mongoose");
const { default: validator } = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../db/config");
const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  email: {
    trim: true,
    unique: true,
    type: String,
    required: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlenght: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password con not contain password");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
userSchema.methods.generateAuthToken = async function () {
  console.log("generateauth token called");
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, secretKey);
  user.tokens = user.tokens.concat({ token });
  try {
    await user.save();
  } catch (error) {
    throw new Error(error.message);
  }
  return token;
};
userSchema.pre("save", async function (next) {
  const user = this;
  console.log("user password", user.password);
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
    console.log("user hashed password", user.password);
  }
  next();
});

userSchema.statics.findByCredentials = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Unable to login");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Unable to login");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
const User = mongoose.model("User", userSchema);
module.exports = User;
