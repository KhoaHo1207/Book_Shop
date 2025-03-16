import { generateAcessToken } from "../middlewares/token.js";
import User from "../models/User.js";
export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (password.lenght < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }
    if (username.length < 3) {
      return res.status(400).json({
        message: "Username must be at least 3 characters",
      });
    }
    //check if user already exists
    // const isExistedUser = await User.findOne({
    //   $or: [{ email: email }, { username: username }],
    // });
    // if (isExistedUser) {
    //   return res.status(400).json({
    //     message: "User are alreay existed",
    //   });
    // }
    const isExistedEmail = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (isExistedEmail) {
      return res.status(400).json({
        message: "Email are alreay existed",
      });
    }
    const isExistedUsername = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (isExistedUsername) {
      return res.status(400).json({
        message: "Username are alreay existed",
      });
    }
    //get random avatar

    const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;
    const user = new User({
      email,
      username,
      password,
      profileImage,
    });
    await user.save();

    const token = generateAcessToken(user._id);
    res.status(201).json({
      //   token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Error in register route", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        message: "All fiels are required",
      });
    //check if user exist
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        message: "User is not existed",
      });
    //check if password is correct
    const isPasswordCorerct = await user.comparePassword(password);
    if (!isPasswordCorerct)
      return res.status(400).json({
        message: "Invalid credentials",
      });

    const token = generateAcessToken(user._id);
    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Error in login route", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
