import authRouter from "./authRoutes.js";
import bookRouter from "./bookRoutes.js";
const initRoutes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/books", bookRouter);
};

export default initRoutes;
