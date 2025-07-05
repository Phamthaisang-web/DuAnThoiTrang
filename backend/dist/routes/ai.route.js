"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ai_controller_1 = require("../controllers/ai.controller");
const router = express_1.default.Router();
// POST /api/ai/ask => gọi AI để phân tích và trả lời
router.post("/ask", ai_controller_1.askProductAI);
exports.default = router;
//# sourceMappingURL=ai.route.js.map