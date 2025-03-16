const express = require("express");
const {
  handelUserContact,
  handelUserLogin,
  handelUserProfile,
  handelUserSignup,
  handelUserCart,
  showProducts
} = require("../controller/user");


const router = express.Router();

router.post("/signup", handelUserSignup);
router.post("/login", handelUserLogin);
router.post("/contact", handelUserContact);
router.get("/profile", handelUserProfile);
router.get("/get-items", showProducts)

module.exports = router;
