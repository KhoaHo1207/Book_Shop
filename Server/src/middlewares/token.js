import jwt from "jsonwebtoken";
export const generateAcessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
