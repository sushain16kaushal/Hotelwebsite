import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  // 1. Header se token nikalna
  const authHeader = req.headers.token; // Ya 'authorization'
  
  if (authHeader) {
    const token = authHeader; // Thunder Client mein hum 'token' naam se bhejenge
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      
      // 2. Check karna ki kya user Admin hai?
      if (user.role === "admin") {
        req.user = user;
        next(); // Sab sahi hai, aage badhne do (Room manage karne do)
      } else {
        return res.status(403).json("You are not authorized!");
      }
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};