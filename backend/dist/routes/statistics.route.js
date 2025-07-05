"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const statistics_controller_1 = require("../controllers/statistics.controller");
const router = express_1.default.Router();
router.get("/summary", statistics_controller_1.getSummaryStats);
router.get("/revenue", statistics_controller_1.getRevenue);
exports.default = router;
//# sourceMappingURL=statistics.route.js.map