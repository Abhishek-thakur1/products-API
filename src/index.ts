require("dotenv").config();
import express, { Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import config from "config";
import validateEnv from "./utils/validEnv";
import { AppDataSource } from "./utils/data-source";
import logger from './shared/Logger'
import redisClient from "./utils/connectRedis";

AppDataSource.initialize()
    .then(async () => {

        logger.info("Database✳️  connected");
        // VALIDATE ENV
        validateEnv();

        const app = express();

        // MIDDLEWARE
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser());

        if (process.env.NODE_ENV === "development") {
            app.use(morgan("dev"));
        }

        // 1. Body parser

        // 2. Logger

        // 3. Cookie Parser

        // 4. Cors

        // ROUTES

        // HEALTH CHECKER
        app.get("/api/healthchecker", async (_, res: Response) => {
            const message = await redisClient.get("try");
            res.status(200).json({
                status: "success",
                message,
            });
        });

        // UNHANDLED ROUTE

        // GLOBAL ERROR HANDLER

        const port = config.get<number>("port");
        app.listen(port);

        logger.info(`Server🎇 is running on http://localhost:${port}`);
        
    })
    .catch((error) => logger.error(error));
