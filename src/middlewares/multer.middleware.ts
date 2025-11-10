import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import multer, { diskStorage } from 'multer';
import path from 'path';
import util from 'util';
import { v4 as uuidv4 } from 'uuid';

// ✅ Ensure folders exist
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// ✅ Check file type (example: only images/videos/docs)
const checkFileType = (file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/', 'video/', 'application/pdf'];
  if (allowedTypes.some((type) => file.mimetype.startsWith(type))) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}`));
  }
};

// ✅ Local disk storage
const getLocalStorage = () => {
  return diskStorage({
    destination: (_req, file, cb) => {
      const uploadDir = path.join(__dirname, '../../public/uploads');
      ensureDir(uploadDir);
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
      const unique = `${base}_${Date.now()}_${uuidv4().slice(0, 6)}${ext}`;
      cb(null, unique);
    },
  });
};

// ✅ Middleware wrapper
export const fileUpload = (maxSizeMB: number) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uploader = multer({
      storage: getLocalStorage(),
      limits: { fileSize: maxSizeMB * 1024 * 1024 },
      fileFilter: (_req, file, cb) => checkFileType(file, cb),
    }).any();

    const uploadPromise = util.promisify(uploader);
    await uploadPromise(req, res);

    next();
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message || 'File upload failed' });
  }
};
