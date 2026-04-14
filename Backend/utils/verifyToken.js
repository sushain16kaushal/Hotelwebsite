import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  // 1. Header se token nikalna (Axios 'Authorization' header bhejta hai)
  const authHeader = req.headers.authorization; 
  
  if (authHeader) {
    // Agar 'Bearer <token>' format mein hai toh:
    const token = authHeader.split(" ")[1] || authHeader; 
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      
      // 2. Check role
      if (user.role === "admin") {
        req.user = user;
        next();
      } else {
        return res.status(403).json("You are not authorized!");
      }
    });
  } else {
    // Agar token naam ka header bhi check karna chahte ho (for safety)
    const backupToken = req.headers.token;
    if (backupToken) {
       // ... wahi logic repeat kar sakte ho ya seedha fail kar do
    }
    return res.status(401).json("You are not authenticated!");
  }
};