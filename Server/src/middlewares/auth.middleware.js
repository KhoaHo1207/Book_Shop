import jwt from "jsonwebtoken";
import User from "../models/User.js";

// //request from client
// const response = await fetch (`http://localhost:3000/api/books`, {
//     method: "POST",
//     body: JSON.stringify({
//         title,
//         caption
//     }),
//     headers: {
//         Authorization: `Bearer ${token}`
//     }
// })
const protectRoute = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token)
      return res.status(401).json({
        message: "No authenication token, access denied",
      });

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //find user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(401).json({ message: "Token is invalid" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protect route middleware", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default protectRoute;
