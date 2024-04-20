// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Predefined user credentials
const predefinedUser = {
  username: "admin@gmail.com",
  password: "SIO@2024",
};

// Middleware to validate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "YOUR_SECRET_KEY", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).send("User created");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User login
// router.post('/login', async (req, res) => {
//   try {
//     console.log(req.body);
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).send("Authentication failed");
//     }
//     const token = jwt.sign({ userId: user._id }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// User login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if provided credentials match predefined user
    if (
      username !== predefinedUser.username ||
      password !== predefinedUser.password
    ) {
      return res.status(401).send("Authentication failed");
    }

    // If credentials match, generate JWT token
    const token = jwt.sign({ userId: username }, "YOUR_SECRET_KEY", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/validateToken", authenticateToken, (req, res) => {
  // If token is valid, return success
  res.sendStatus(200);
});

module.exports = router;
