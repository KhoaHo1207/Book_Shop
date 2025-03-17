import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
export const createBook = async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;
    if (!image || !title || !caption || !rating) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    //upload image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    //save to database

    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    await newBook.save();
    return res.status(201).json(newBook);
  } catch (error) {
    console.error("Create book", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const response = await fetch("http://localhost:3000/api/api/books?page=1&limit=5")
//pagination => infinite scroll
export const getBooks = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const books = await Book.find()
      .sort({ createAt: -1 }) //desc
      .skip(skip)
      .limit(limit)
      .populate("user", "user profileImage");

    const totalBooks = await Book.countDocuments();
    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.error("Get books", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
