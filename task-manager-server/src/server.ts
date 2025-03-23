import app from "./app";
import { sequelize } from "./config/db.config";
import { logger } from "./logger";
import ApiError from "./middlewares/ApiError";

const PORT = process.env.PORT || 8080;
sequelize
  .sync()
  .then(() => {
    logger.info("Database connected and models synced.");

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}.`);
    });
  })
  .catch((error: Error) => {
    throw new ApiError(500, "Database connection error", error);
  });
