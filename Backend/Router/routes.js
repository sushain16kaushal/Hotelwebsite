import {Router} from "express";
import { verifyAdmin } from "../utils/verifyToken.js";
import fs from 'fs';
import {login} from '../Controllers/authController.js';
import Hotel from '../Models/Hotel.js';
import Dining from '../Models/Dining.js';
import SiteConfig from '../Models/SiteConfig.js';
import mongoose from "mongoose";
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
router.put("/update-features/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: { features: req.body.features } }, // 'features' ek array hoga strings ka
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    res.status(500).json(err.message);
  }
});
router.post("/add-room", verifyAdmin, (req, res) => {
    // Room save karne ka logic yahan aayega
    res.status(200).json("Room has been added by Admin!");
});
export default router;
