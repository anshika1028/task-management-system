import cors from "cors";
import express from "express";
import helmet from "helmet";
import { logger } from "./logger";
import errorHandler from "./middlewares/error-handler";
import authRoutes from "./routes/auth.routes";
import metaRoutes from "./routes/meta.routes";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";
import { setupSwagger } from "./config/swagger";

const app = express();

// ✅ Security Middleware
app.use(cors());
app.use(helmet());
app.use(express.json()); // Parse JSON request bodies

// ✅ Setup Swagger
setupSwagger(app);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ Global Error Handling
app.use(errorHandler);
logger.info("*** App initialized ***");
export default app;
