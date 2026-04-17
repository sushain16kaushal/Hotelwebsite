import {Router} from "express";
import { verifyAdmin } from "../utils/verifyToken.js";
import fs from 'fs';
import {login} from '../Controllers/authController.js';
import Hotel from '../Models/Hotel.js';
import Dining from '../Models/Dining.js';
import SiteConfig from '../Models/SiteConfig.js';
import mongoose from "mongoose";
import passportConfig from "passport";
import jwt from 'jsonwebtoken';
import Customer from "../Models/Customer.js";
import { custlogin,signup,forgotPassword,resetPassword } from "../Controllers/authController.js";
/*const data=JSON.parse(
    fs.readFileSync(new URL("../data.json",import.meta.url),"utf-8")
)*/
const router=Router();
/*router.get("/data",(req,res)=>{
    res.send(data)
})*/
//router.post("/register-admin-secret", registerAdmin);
router.get("/all-content", async (req, res) => {
  try {
    const hotels = await Hotel.find();
    const dinings = await Dining.find();
    const config = await SiteConfig.findOne();

    // Wahi structure wapas bhejenge jo Frontend expect kar raha hai
    res.status(200).json({
      ...config._doc,
      hotels,
      dinings
    });
  } catch (err) {
  
    res.status(500).json(err);
  }
});
// Ye route specific hotel ka data nikaalne ke liye hai
router.get("/hotel/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json("Hotel record not found in database!");
    }
    
    res.status(200).json(hotel);
  } catch (err) {
    // Agar ID ka format galat hua toh ye catch karega
    res.status(500).json({ message: "Invalid ID format or Server Error", error: err.message });
  }
});

router.post("/login", login);
router.delete("/delete-hotel/:id", verifyAdmin, async (req, res) => {
  try {
    const idParam = req.params.id;

    console.log("ID RECEIVED:", idParam);

    // ✅ IMPORTANT VALIDATION
    if (!mongoose.Types.ObjectId.isValid(idParam)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const result = await Hotel.findByIdAndDelete(idParam);

    console.log("DELETE RESULT:", result);

    if (!result) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json({ message: "Hotel deleted successfully ✅" });

  } catch (err) {
    console.error("FULL DELETE ERROR:", err); // 🔥 FULL error print
    res.status(500).json({ message: "Server Crash", error: err.message });
  }
});
router.put("/update-prices/:id", async (req, res) => {
  try {
    // Dhyaan dena: Yahan findByIdAndUpdate use karna agar tum _id bhej rahe ho
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id, 
      { $set: { roomCategories: req.body.roomCategories } },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    res.status(500).json(err.message);
  }
});
// Dining Routes
// 1. Get Single Dining Details
router.get("/dining/:id", async (req, res) => {
  try {
    const venue = await Dining.findById(req.params.id);
    res.json(venue);
  } catch (err) {
    res.status(500).json({ message: "Dining not found" });
  }
});

// 2. Update Dining Menu (Protected)
router.put("/update-dining/:id", async (req, res) => {
  try {
    const updatedDining = await Dining.findByIdAndUpdate(
      req.params.id,
      { $set: { fullMenu: req.body.fullMenu } }, // Sirf menu array update hoga
      { new: true }
    );
    res.status(200).json(updatedDining);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// 3. Delete Dining (Optional but recommended)
router.delete("/delete-dining/:id", async (req, res) => {
    try {
        await Dining.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Dining removed" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});
// --- AUTH ROUTES ---
router.post("/login", login); // Admin Login
router.post("/cust-login", custlogin); // Customer Login
router.post("/signup", signup); // Customer Signup
router.post("/forgot-password", forgotPassword); // Forgot Password Logic
router.put("/reset-password/:token", resetPassword); // Reset Password Logic

// --- GOOGLE OAUTH ROUTES ---
router.get('/google', passportConfig.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passportConfig.authenticate('google', { session: false, failureRedirect: '/login' }), 
  (req, res) => {
    // Passport logic execution ke baad req.user mein data hota hai
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    const userData = encodeURIComponent(JSON.stringify({
        name: req.user.name,
        email: req.user.email,
        profilePic: req.user.profilePic,
        role: req.user.role
    }));

    // Redirect to Frontend LoginSuccess Page
    res.redirect(`${process.env.PRODUCTIONURL}/login-success?token=${token}&details=${userData}`);
});

// 2. Update Dining Menu (Protected)
router.put("/update-dining/:id", async (req, res) => {
  try {
    const updatedDining = await Dining.findByIdAndUpdate(
      req.params.id,
      { $set: { fullMenu: req.body.fullMenu } }, // Sirf menu array update hoga
      { new: true }
    );
    res.status(200).json(updatedDining);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// 3. Delete Dining (Optional but recommended)
router.delete("/delete-dining/:id", async (req, res) => {
    try {
        await Dining.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Dining removed" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});

export default router;
