import express from "express";
const router = express.Router();
import { Request, Response } from 'express'

import multer from 'multer'
import path from "path";
import {buildSlugify } from "../helpers/slugify.helper";

const storage = multer.diskStorage({
    // vị trí lưu
    destination: function (req, file, cb) {
      cb(null, 'public/upload/images')
    },
    //custom tên file
    filename: function (req, file, cb) {
        const fileInfo = path.parse(file.originalname);
        console.log('<<=== 🚀 fileInfo ===>>',fileInfo);
        cb(null, buildSlugify(fileInfo.name) + '-' + Date.now() + fileInfo.ext)
    }
  })
  
  const upload = multer({ storage: storage })
// localhost:3000/api/v1/upload
router.post('/upload', upload.single('file'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' })
    return
  }

  const fileUrl = `/upload/images/${req.file.filename}`

  res.status(200).json({
    message: 'File uploaded successfully!',
    url: fileUrl,
  })
})


export default router;