const multer = require("multer");
const path = require("path");

// Multer config
const maxSize = 10000000;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
// multer({
//   storage: multer.diskStorage({ destination: function (req, file, cb) {
//     cb(null, '/uploads');
//   }}),
//   fileFilter: (req, file, cb) => {
//     // console.log({ file });
//     let ext = path.extname(file.originalname);
//     console.log(path.dirname(file))
//     if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
//       cb(new Error(`File type is not supported, must be a .png or .jpg or .jpeg`), false);
//       return;
//     }
//     cb(null, true);
//   },
//   limits: { fileSize: maxSize }

// });

module.exports = multer({ storage: storage }).single('image');;