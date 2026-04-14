export const verifyAdmin = (req, res, next) => {
  // 1. Teeno raaste check karo (Standard, tumhara purana header, aur lowercase)
  const authHeader = req.headers.authorization || req.headers.token || req.headers.Authorization;
  
  console.log("Headers received:", req.headers); // Render logs mein dikhega ki kya aa raha hai

  if (!authHeader) {
    return res.status(401).json("You are not authenticated! No header found.");
  }

  // 2. Token nikalne ka foolproof tarika
  const token = authHeader.startsWith("Bearer ") 
                ? authHeader.split(" ")[1] 
                : authHeader;

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT Verify Error:", err.message); // Secret match nahi hua ya token expire hai
      return res.status(403).json("Token is not valid!");
    }
    
    if (user.role === "admin") {
      req.user = user;
      next();
    } else {
      return res.status(403).json("You are not authorized! Role is: " + user.role);
    }
  });
};