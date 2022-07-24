import express from "express";
import { getUser } from "../controllers/user.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get currently logged in user
router.get("/me", getUser);

export default router;
