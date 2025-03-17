import express from "express";
const router = express.Router();
import {
  createBook,
  getBooks,
  deleteBook,
  getUserBook,
} from "../controller/book.js";
import protectRoute from "../middlewares/auth.middleware.js";
router.post("/", protectRoute, createBook);
router.get("/", protectRoute, getBooks);
router.get("/user", protectRoute, getUserBook);
router.delete("/:id", protectRoute, deleteBook);
export default router;
