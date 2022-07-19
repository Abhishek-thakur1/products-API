import cookieParser from "cookie-parser";
import express, { Request, Response, NextFunction } from "express";
import morgan from 'morgan'
import logger from "./shared/Logger";
import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode} from "http-status-codes";
// import BaseRouter from "./routes";

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

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
