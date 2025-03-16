const express = require("express");
const { checkForAuthentication } = require("../middleware/auth");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

router.get("/signup", (req, res) => {
  res.render("signup", { title: "Signup", error: null });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Login", error: null });
});

router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});

router.get("/explore", (req, res) => {
  res.render("explore", { title: "Explore" });
});

router.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

router.get("/cart", (req, res) => {
  const token = req.cookies?.uid;
  if (!token) return res.render("login", { error: null });
  res.render("cart", { title: "Cart" });
});

router.get("/profile", (req, res) => {
  const token = req.cookies?.uid;
  if (!token) return res.render("login", { error: null });
  res.render("profile");
});

router.get("/logout", (req, res) => {
  res.clearCookie("uid");
  res.redirect("/login");
});

module.exports = router;
