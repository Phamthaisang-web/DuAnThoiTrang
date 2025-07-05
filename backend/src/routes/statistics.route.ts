import express from "express";
import {
  getSummaryStats,
  getRevenue,
} from "../controllers/statistics.controller";

const router = express.Router();

router.get("/summary", getSummaryStats);
router.get("/revenue", getRevenue);

export default router;
