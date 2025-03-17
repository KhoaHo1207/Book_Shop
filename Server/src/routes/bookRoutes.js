import express from "express";
const router = express.Router();
import { createBook, getBooks } from "../controller/book.js";
import protectRoute from "../middlewares/auth.middleware.js";
router.post("/", protectRoute, createBook);
router.get("/", protectRoute, getBooks);
export default router;
