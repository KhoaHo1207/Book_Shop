import mongoose from "mongoose";
import "dotenv/config";
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.M0NGO_URI);
    console.log(`Database connected ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1); //exit with failture
  }
};
