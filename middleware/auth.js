const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Invalid token format" });
    }
    console.log("Auth header:", req.header("Authorization"));

    const token = authHeader.split(" ")[1]; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    req.user = { userId: decoded.userId }; // ✅ This line is mandatory

    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(401).json({ msg: "Auth failed" });
  }
};

module.exports = { authenticate };
