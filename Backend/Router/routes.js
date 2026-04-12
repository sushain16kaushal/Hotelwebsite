import {Router} from "express";
import fs from 'fs';
const data=JSON.parse(
    fs.readFileSync(new URL("../data.json",import.meta.url),"utf-8")
)
const router=Router();
router.get("/data",(req,res)=>{
    res.send(data)
})

export default router;