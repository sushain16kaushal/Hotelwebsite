import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  // Check karo Authorization header (Standard) ya fir sirf 'token' header
  const authHeader = req.headers.authorization || req.headers.token;
  
  if (authHeader) {
    // Agar 'Bearer <token>' hai toh split karo, warna direct token use karo
    const token = authHeader.startsWith("Bearer ") 
                  ? authHeader.split(" ")[1] 
                  : authHeader;
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      
      if (user && user.role === "admin") {
        req.user = user;
        next();
      } else {
        return res.status(403).json("You are not authorized!");
      }
    });
  } else {
    return res.status(401).json("You are not authenticated! No token found in headers.");
  }
};