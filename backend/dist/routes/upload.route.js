"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const slugify_helper_1 = require("../helpers/slugify.helper");
const storage = multer_1.default.diskStorage({
    // vị trí lưu
    destination: function (req, file, cb) {
        cb(null, 'public/upload/images');
    },
    //custom tên file
    filename: function (req, file, cb) {
        const fileInfo = path_1.default.parse(file.originalname);
        console.log('<<=== 🚀 fileInfo ===>>', fileInfo);
        cb(null, (0, slugify_helper_1.buildSlugify)(fileInfo.name) + '-' + Date.now() + fileInfo.ext);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// localhost:3000/api/v1/upload
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }
    const fileUrl = `/upload/images/${req.file.filename}`;
    res.status(200).json({
        message: 'File uploaded successfully!',
        url: fileUrl,
    });
});
exports.default = router;
//# sourceMappingURL=upload.route.js.map