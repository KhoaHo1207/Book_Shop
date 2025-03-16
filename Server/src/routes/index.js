import authRouter from "./authRoutes.js";
const initRoutes = (app) => {
  app.use("/api/auth", authRouter);
};

export default initRoutes;
