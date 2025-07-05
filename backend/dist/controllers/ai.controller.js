"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askProductAI = void 0;
const openai_1 = require("openai");
const product_service_1 = __importDefault(require("../services/product.service"));
const brand_model_1 = __importDefault(require("../models/brand.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
// ✅ Khởi tạo SDK OpenRouter
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "https://your-app-testing.co", // ⚠️ Thay bằng domain thật
        "X-Title": "ThoiTrang", // ⚠️ Tên app của bạn
    },
});
const askProductAI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question } = req.body;
        if (!question || typeof question !== "string") {
            res.status(400).json({ error: "❌ Câu hỏi không hợp lệ." });
            return;
        }
        // 1. Dùng GPT để phân tích câu hỏi
        const filterAnalysis = yield openai.chat.completions.create({
            model: "openai/gpt-3.5-turbo-0613",
            messages: [
                {
                    role: "system",
                    content: `Bạn là công cụ phân tích câu hỏi để sinh object JSON filter sản phẩm theo các trường: 
- name: tên sản phẩm
- minPrice: giá thấp nhất (VND)
- maxPrice: giá cao nhất (VND)
- sizes: các size (ví dụ: "S", "M", "L", "XL")
- colors: các màu (ví dụ: "đỏ", "xanh", "đen")
- brand: tên thương hiệu (ví dụ: "Nike", "Adidas")
- category: danh mục sản phẩm (ví dụ: "áo thun", "quần jean")

Hãy chỉ trả về object JSON đúng định dạng.`,
                },
                {
                    role: "user",
                    content: `Phân tích câu hỏi: "${question}". Trả về object JSON.`,
                },
            ],
            temperature: 0.2,
        });
        const filterText = filterAnalysis.choices[0].message.content || "{}";
        const filterQuery = JSON.parse(filterText);
        // 2. Chuẩn hóa brand và category từ tên → ObjectId
        if (filterQuery.brand) {
            const brandDoc = yield brand_model_1.default.findOne({
                name: new RegExp(`^${filterQuery.brand}$`, "i"),
            });
            if (brandDoc) {
                filterQuery.brand = brandDoc._id.toString();
            }
            else {
                delete filterQuery.brand;
            }
        }
        if (filterQuery.category) {
            const categoryDoc = yield category_model_1.default.findOne({
                name: new RegExp(`^${filterQuery.category}$`, "i"),
            });
            if (categoryDoc) {
                filterQuery.category = categoryDoc._id.toString();
            }
            else {
                delete filterQuery.category;
            }
        }
        // 3. Lấy danh sách sản phẩm
        const { products } = yield product_service_1.default.getAllProducts(Object.assign(Object.assign({}, filterQuery), { limit: 10 }));
        if (products.length === 0) {
            res.json({ answer: "❌ Không có sản phẩm nào phù hợp với yêu cầu." });
            return;
        }
        // 4. Tạo danh sách mô tả sản phẩm
        const productList = products
            .map((p) => `- ${p.name} (${p.price.toLocaleString()} VND)`)
            .join("\n");
        // 5. GPT tạo câu trả lời thân thiện
        const chatResponse = yield openai.chat.completions.create({
            model: "openai/gpt-3.5-turbo-0613",
            messages: [
                {
                    role: "system",
                    content: "Bạn là trợ lý bán hàng thân thiện, tư vấn sản phẩm thời trang bằng tiếng Việt.",
                },
                {
                    role: "user",
                    content: `Danh sách sản phẩm:\n${productList}\n\nKhách hỏi: "${question}"`,
                },
            ],
        });
        const answer = chatResponse.choices[0].message.content ||
            "🤖 Xin lỗi, tôi không hiểu câu hỏi của bạn.";
        res.json({ answer });
    }
    catch (err) {
        console.error("Lỗi AI:", err);
        res.status(500).json({ error: "❌ Lỗi hệ thống AI" });
    }
});
exports.askProductAI = askProductAI;
//# sourceMappingURL=ai.controller.js.map