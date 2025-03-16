const express = require("express");

const { addToCart, getCart, deleteCart } = require("../controller/cart");
const { checkForAuthentication } = require("../middleware/auth");

const router = express.Router();

router.post("/add-to-cart", checkForAuthentication, addToCart);
router.get("/get-cart", getCart);
router.delete("/delete-cart/:id", deleteCart);

module.exports = router;
