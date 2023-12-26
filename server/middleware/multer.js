import multer from "multer";
import path from "path";

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    let fileName =
      path.basename(file.originalname) +
      "_" +
      Date.now() +
      path.extname(file.originalname);
    cb(null, fileName);
    return fileName;
  },
});

async function fileFilter(req, file, cb) {
  if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
    return cb("ERROR:請上傳圖片檔(png|jpg|jpeg)", false);
  }
  cb(undefined, true);
}

export const imageUpload = multer({
  storage: imageStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
});
