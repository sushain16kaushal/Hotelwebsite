import {Router} from "express";
import { verifyAdmin } from "../utils/verifyToken.js";
import fs from 'fs';
import {login} from '../Controllers/authController.js';
import Hotel from '../Models/Hotel.js';
import Dining from '../Models/Dining.js';
import SiteConfig from '../Models/SiteConfig.js';
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
router.post("/login", login);
router.delete("/delete-hotel/:id", verifyAdmin, async (req, res) => {
  try {
    const idToDelete = req.params.id;
    console.log("Deleting hotel with ID:", idToDelete);

    // Try finding by BOTH (hotelId as number AND as string for safety)
    const result = await Hotel.findOneAndDelete({ 
      $or: [
        { hotelId: idToDelete }, 
        { hotelId: Number(idToDelete) } 
      ] 
    });
    
    if (!result) {
      return res.status(404).json("Hotel not found in DB!");
    }
    
    res.status(200).json("Hotel has been deleted successfully.");
  } catch (err) {
    console.error("Delete Crash Error:", err);
    res.status(500).json({ message: "Server Crash", error: err.message });
  }
});
router.post("/add-room", verifyAdmin, (req, res) => {
    // Room save karne ka logic yahan aayega
    res.status(200).json("Room has been added by Admin!");
});
export default router;