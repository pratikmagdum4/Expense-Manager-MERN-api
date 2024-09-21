const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Sign Up
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("The credentials are ",email , password)
console.log("login")
  try {
    const user = await User.findOne({ email });
        console.log("Reached here 0");
console.log("user is",user)
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });
    console.log("Reached here 1");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });
    console.log("Reached here 2");

    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });
    console.log("Reached here 3")
    res.json({ token, user: { username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

