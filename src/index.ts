require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import config from "config";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AppDataSource } from "./utils/data-source";
import AppError from "./utils/appError";
import validateEnv from "./utils/validEnv";
import logger from "./shared/Logger";
import redisClient from "./utils/connectRedis";
// Routes
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import productRouter from "./routes/product.routes";

AppDataSource.initialize()
    .then(async () => {

        logger.info("Database✳️  connected");
        
        // VALIDATE ENV
        validateEnv();

        const app = express();

        // MIDDLEWARE
        app.use(express.urlencoded({ extended: true }));

        // 1. Body parser
        app.use(express.json({ limit: "10kb" }));

        // 2. Logger
        if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

        // 3. Cookie Parser
        app.use(cookieParser());

        // 4. Cors
        app.use(
            cors({
                origin: config.get<string>("origin"),
                credentials: true,
            })
        );

        // ROUTES
        app.use("/api/auth", authRouter);
        app.use("/api/users", userRouter);
        app.use("/api/products", productRouter);

        // HEALTH CHECKER
        app.get("/api/healthchecker", async (_, res: Response) => {
            const message = await redisClient.get("try");
            res.status(200).json({
                status: "success",
                message,
            });
        });

        // UNHANDLED ROUTE
        app.all("*", (req: Request, res: Response, next: NextFunction) => {
            next(new AppError(404, `Route ${req.originalUrl} not found`));
        });

        // GLOBAL ERROR HANDLER
        app.use(
            (
                error: AppError,
                req: Request,
                res: Response,
                next: NextFunction
            ) => {
                error.status = error.status || "error";
                error.statusCode = error.statusCode || 500;

                res.status(error.statusCode).json({
                    status: error.status,
                    message: error.message,
                });
            }
        );

        const port = config.get<number>("port");
        app.listen(port);

        logger.info(`Server🎇 is running on http://localhost:${port}`);
        
    })
    .catch((error) => logger.error(error));
