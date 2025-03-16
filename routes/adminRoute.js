const express = require("express");
const {
  handelAdminSignup,
  handelAdminLogin,
  addProduct,
  getArtworks,
  deleteArtwork,
  allUsers,
} = require("../controller/admin");
const upload = require("../config/multer");

const router = express.Router();

router.post("/signup", handelAdminSignup);
router.post("/login", handelAdminLogin);
router.post("/add-item", upload.single("imgUrl"), addProduct);
router.get("/get-items", getArtworks);
router.delete("/delete-item/:id", deleteArtwork);
router.get("/all-users", allUsers)

module.exports = router;
