const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const errorHandler = require("./utils").errorHandler;
const config = require("./config.json");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

app.use(
  session({
    secret: "your-session-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

const url = `mongodb+srv://${config.username}:${config.userpassword}@${config.dbname}.${config.userstring}.mongodb.net/${config.dbname}?retryWrites=true&w=majority&appName=Valtech`;
mongoose
  .connect(url)
  .then(() => console.log("DB Connected!!"))
  .catch((error) => console.log("Error", error));

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = mongoose.model(
  "User",
  new Schema({
    id: ObjectId,
    firstName: { type: String, required: true },
    lastName: String,
    email: { type: String, unique: true, required: true },
    phoneNo: String,
    password: { type: String, required: true },
  })
);

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNo, password } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      phoneNo,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid email or password" });

    req.session.user = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNo: user.phoneNo,
    };

    res.status(200).json({
      message: "Login successful",
      user: req.session.user,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/home", async (req, res) => {
  if (!req.session.user || !req.session.user._id)
    return res.status(401).json({ error: "Not authenticated" });

  try {
    const user = await User.findById(req.session.user._id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send({ error: "Could not log out" });
    res.send({ message: "Logout successful" });
  });
});

app.listen(config.port, config.host, () => {
  console.log(`Server running on ${config.host}:${config.port}`);
});
