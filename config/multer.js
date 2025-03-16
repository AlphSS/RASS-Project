const multer = require("multer");
const cloudinary = require("./cloudainary");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;