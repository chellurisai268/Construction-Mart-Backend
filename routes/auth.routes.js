const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
const router = express.Router();
const mcurl =
"mongodb+srv://jvdimvp:Pradeep903@cluster0.d2cwd.mongodb.net/ConstructionMart?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mcurl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

router.post("/signup", async (req, res) => {
  console.log("req.body", req.body);
  const isEmpty = Object.values(req.body).some(
    (value) =>
      value === "" ||
      value === null ||
      value === undefined ||
      (typeof value === "number" && isNaN(value))
  );

  if (isEmpty) {
    return res.json({ msg: "All fields must be filled" });
  }

  const username = User.find({ username: req.body.username });
  console.log("username", username.user);
  if (username.user) {
    res.json({ msg: `User exists ${req.body.username}` });
    console.log("user exists");
  } else {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({ ...req.body, password: hashedPassword });
    // const user = new User(req.body);
    user
      .save()
      .then((users) => {
        console.log(users);
        res.json({ msg: "Signup success" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ msg: "Signup failed", error: err.message });
      });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const isEmpty = Object.values(req.body).some((value) => value.trim() === "");

  if (isEmpty) {
    return res.json({ msg: "All fields must be filled" });
  }
  const user = User.findOne({ username: username });
  console.log("user login", user);
  user
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.json({ msg: "User not found" });
      }
      // Compare the provided password with the stored hashed password
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.json({ msg: "Error comparing password", error: err.message });
        }

        if (result) {
          // Password matched, generate JWT token
          // const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, "secretkey", { expiresIn: "1h" });
          const token = jwt.sign({ ...user }, "secretkey");
          res.json({
            msg: "Login success",
            token,
            role: user.role,
            username: user.username,
            mobile: user.mobile,
          });
        } else {
          // Password did not match
          res.json({ msg: "Invalid credentials" });
        }
      });
      // const token = jwt.sign({ ...user }, "secretkey");
      // console.log(token);
      // res.json({
      //   msg: "login success",
      //   token,
      //   role: user.role,
      //   username: user.username,
      //   mobile: user.mobile,
      // });
    })
    .catch((err) => {
      console.log(err);
      res.json({ msg: "login failed", error: err.message });
    });
});
module.exports = router;
