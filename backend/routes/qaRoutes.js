// routes/qaRoutes.js
import express from "express";
import { askQuestion } from "../controllers/qaController.js";

const router = express.Router();

// POST /api/repo/ask
router.post("/ask", askQuestion);

export default router;
