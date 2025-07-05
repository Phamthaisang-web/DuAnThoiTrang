import express from "express";
import { askProductAI } from "../controllers/ai.controller";

const router = express.Router();

// POST /api/ai/ask => gọi AI để phân tích và trả lời
router.post("/ask", askProductAI);

export default router;
