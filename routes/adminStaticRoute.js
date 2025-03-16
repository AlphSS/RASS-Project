const express = require("express");

const router = express.Router();

router.get("/adminsignup", (req, res) => {
  res.render("adminSignup", { error: null });
});

router.get("/adminlogin", (req, res) => {
  res.render("adminlogin", { error: null });
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

router.get("/upl", (req, res) => {
  res.render("upl");
});

router.get('/userDetails', (req,res)=>{
  res.render("userDetails")
})

module.exports = router;
