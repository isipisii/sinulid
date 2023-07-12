import multer from 'multer';
import path from 'path';


export default multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);

    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      const error: any = new Error('File type is not supported');
      cb(error, false);
      return;
    }

    cb(null, true);
  },
});