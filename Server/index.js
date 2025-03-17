import express from "express";
import "dotenv/config";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 8080;
import { connectDB } from "./src/lib/db.js";
import initRoutes from "./src/routes/index.js";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
initRoutes(app);
app.listen(PORT, () => {
  console.log(`Server is on port ${PORT}`);
  connectDB();
});
