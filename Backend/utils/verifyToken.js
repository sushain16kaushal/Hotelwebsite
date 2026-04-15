import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.token || req.headers.Authorization;

  console.log("Headers received:", req.headers);

  if (!authHeader) {
    return res.status(401).json("You are not authenticated! No header found.");
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT Verify Error:", err.message);
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