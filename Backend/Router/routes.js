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
    const idFromParams = req.params.id;
    console.log("Delete request for ID:", idFromParams);

    // Hotel.findOneAndDelete use kar rahe hain kyunki hum 'hotelId' (115) bhej rahe hain
    // Number() conversion zaroori hai kyunki DB mein hotelId number ho sakta hai
    const result = await Hotel.findOneAndDelete({ 
      $or: [
        { hotelId: idFromParams }, 
        { hotelId: Number(idFromParams) }
      ] 
    });

    if (!result) {
      console.log("Hotel not found in database.");
      return res.status(404).json("Hotel not found!");
    }

    console.log("Delete Successful!");
    res.status(200).json("Hotel has been deleted successfully.");
  } catch (err) {
    console.error("CRASH ERROR:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});
    
  
router.post("/add-room", verifyAdmin, (req, res) => {
    // Room save karne ka logic yahan aayega
    res.status(200).json("Room has been added by Admin!");
});
export default router;