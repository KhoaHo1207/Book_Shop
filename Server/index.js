import express from "express";
import "dotenv/config";
const app = express();
const PORT = process.env.PORT || 8080;
import { connectDB } from "./src/lib/db.js";
import initRoutes from "./src/routes/index.js";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initRoutes(app);
app.listen(PORT, () => {
  console.log(`Server is on port ${PORT}`);
  connectDB();
});
