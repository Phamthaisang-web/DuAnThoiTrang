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
Object.defineProperty(exports, "__esModule", { value: true });
const validateSchemaYup = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        }, {
            abortEarly: false, // abortEarly: false để lấy tất cả lỗi thay vì chỉ lấy lỗi đầu tiên
            stripUnknown: true, // stripUnknown: true để loại bỏ các trường không được định nghĩa trong schema
        });
        next();
    }
    catch (err) {
        //console.log(err);
        if (err instanceof Error) {
            //console.error(err);
            res.status(400).json({
                statusCode: 400,
                message: err.errors, // err.errors chứa tất cả các thông điệp lỗi
                typeError: "validateSchema",
            });
        }
        next(err); //next lỗi ra cho app handle
        // res.status(500).json({
        //   statusCode: 500,
        //   message: 'validate Yup Error',
        //   typeError: 'validateSchemaUnknown'
        // });
    }
});
exports.default = validateSchemaYup;
//# sourceMappingURL=validate.middleware.js.map