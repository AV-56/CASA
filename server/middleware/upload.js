import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Agar 'uploads' naam ka folder nahi hai, toh automatic bana dega
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Photo kahan aur kis naye naam se save karni hai
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/'); // Ye 'uploads' folder me save karega
    },
    filename(req, file, cb) {
        // Photo ka naya naam: fieldname-time.extension (taaki naam crash na hon)
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Bhai sirf Images (JPG, JPEG, PNG) allowed hain!'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

export default upload;
