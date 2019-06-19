const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid MimeType");
    if (isValid) {
      error = null;
    }
    cb(error, "images"); //folder name where to store the image
  },
  filename: (req, file, cb) => {
    let name;
    if (file.originalname.length > 0) {
      name = req.userData.userNickname;
    } else {
      name = file.originalname
        .toLocaleLowerCase()
        .split(" ")
        .join("-");
    }
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

module.exports = multer({ storage: storage }).single("image");
