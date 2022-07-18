import cookieParser from "cookie-parser";
import express, { Request, Response, NextFunction } from "express";
import logger from "./shared/Logger";
import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode} from "http-status-codes";
// import BaseRouter from "./routes";

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Add APIs
// app.use("/api", BaseRouter);

// Print API errors...
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message, err);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: err.message,
    });

})


// Export express instance
export default app;
