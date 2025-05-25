const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const errorHandler = require("./utils").errorHandler;
const config = require("./config.json");
const multer = require("multer");
const path = require('path')
 
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

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

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

const Sale = mongoose.model(
  "Sale",
  new mongoose.Schema({
    salespersonid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    customername: {
    type: String,
    required: true
  },
  customeremail: {
    type: String,
    required: true,
    match: [/\S+@\S+\.\S+/, 'Email is invalid']
  },
  customerphone: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, 'Phone number must be 10 digits']
  },
  vehiclebrand: {
    type: String,
    required: true
  },
  vehiclemodel: {
    type: String,
    required: true
  },
  vehicleimage: {
    type: String,
    required: true
  },
  vehicleyear: {
    type: Number,
    required: true
  },
  saledate: {
    type: Date,
    required: true
  },
  saleamount: {
    type: Number,
    required: true
  }
  })
);

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user && req.session.user._id) {
    next();
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

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
 
    res.status(201).json({ message: "User registered successfully", user: savedUser });
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

app.get("/me", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});



app.get('/user/:id', isAuthenticated, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password'); 
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});
 

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Could not log out" });
    res.json({ message: "Logout successful" });
  });
});
 

app.post("/sales", upload.single('vehicleimage'), async (req, res) => {
  try {
    
    const {
      salespersonid,
      customername,
      customeremail,
      customerphone,
      vehiclebrand,
      vehiclemodel,
      vehicleyear,
      saleamount
    } = req.body;

    console.log(req.body);
    const vehicleimage = req.file ? req.file.path : 'uploads/default.jpg';
    const saledate = new Date();
    console.log("saledate : ",saledate);

    const newSale = new Sale({
      salespersonid,
      customername,
      customeremail,
      customerphone,
      vehiclebrand,
      vehiclemodel,
      vehicleyear,
      saledate,
      saleamount,
      vehicleimage
    });

    const saved = await newSale.save();

    console.log('Sale saved to DB', saved); 
    res.status(201).json(saved);

  } catch (err) {
    console.error("Error creating sale:", err);
    res.status(500).json({ error: "Failed to create sale" });
  }
});
 

app.get("/sale/:id", isAuthenticated, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ error: "Sale not found" });
    res.status(200).json(sale);
  } catch (err) {
    console.error("Error fetching sale:", err);
    res.status(500).json({ error: "Failed to fetch sale" });
  }
});

app.put('/sales/:id', upload.single('vehicleimage'), async (req, res) => {
    try {
        const saleId = req.params.id;
        const {
            customername,
            customeremail,
            customerphone,
            vehiclebrand,
            vehiclemodel,
            vehicleyear,
            saleamount
        } = req.body;

        const updatedSale = {
            customername,
            customeremail,
            customerphone,
            vehiclebrand,
            vehiclemodel,
            vehicleyear,
            saleamount
        };

        if (req.file) {
            updatedSale.vehicleimage = req.file.path;
        }

        const sale = await Sale.findByIdAndUpdate(saleId, updatedSale, { new: true });

        if (!sale) return res.status(404).json({ message: 'Sale not found' });

        res.status(200).json(sale);
    } catch (err) {
        console.error('Error updating sale:', err.message);
        res.status(400).json({ message: 'Failed to update sale.', error: err.message });
    }
});

app.get("/sales/:userId", isAuthenticated, async (req, res) => {
  try {
    const sales = await Sale.find({ salespersonid: req.params.userId });
    console.log(sales);
    
    res.status(200).json(sales);
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).json({ error: "Failed to fetch sales" });
  }
});
 

app.get("/sales", isAuthenticated, async (req, res) => {
  try {
    const sales = await Sale.find(); 
    res.status(200).json(sales);
  } catch (err) {
    console.error("Error fetching all sales:", err);
    res.status(500).json({ error: "Failed to fetch all sales" });
  }
});


app.get("/sales/:userId/:saleId", isAuthenticated, async (req, res) => {
  const { userId, saleId } = req.params;
  try {
    const sale = await Sale.findOne({ _id: saleId, salespersonid: userId });
    if (!sale) return res.status(404).json({ error: "Sale not found" });
    res.status(200).json(sale);
  } catch (err) {
    console.error("Error fetching sale:", err);
    res.status(500).json({ error: "Failed to fetch sale" });
  }
});

app.delete("/sale/:id", isAuthenticated, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) return res.status(404).json({ error: "Sale not found" });

    if (sale.salespersonid.toString() !== req.session.user._id) {
      return res.status(403).json({ error: "Not authorized to delete this sale" });
    }

    await Sale.deleteOne({ _id: req.params.id });
    res.json({ message: "Sale deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete sale" });
  }
});

 

app.listen(config.port, config.host, () => {
  console.log(`Server running on ${config.host}:${config.port}`);
});
 

