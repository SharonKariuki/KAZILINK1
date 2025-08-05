const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔐 Protect middleware: Validates token and attaches user to req
const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } else {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }
  } catch (error) {
    console.error("JWT Auth Error:", error);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

// 🛡️ isAdmin middleware: Only allows admin users
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Admin access only" });
  }
};

module.exports = {
  protect,
  isAdmin,
};
