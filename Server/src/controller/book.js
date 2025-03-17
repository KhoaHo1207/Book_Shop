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
export const getUserBook = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createAt: -1,
    }); //desc
    res.json(books);
  } catch (error) {
    console.error("Get user books", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    //check if user is the creator of the book
    if (book.user.toString() !== req.user._id.toString())
      return res.sttaus(401).json({ message: Unauthorized });
    //delete image from cloudinary as well
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log("Error deleting image from cloudinary", error);
      }
    }

    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
    res;
  } catch (error) {
    console.error("Delete book", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
