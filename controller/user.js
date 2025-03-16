const nodemailer = require("nodemailer");
const argon2 = require("argon2");
const { getUser } = require("../services/auth");

const Product = require("../model/productSchema");
const User = require("../model/user");
const { setUser } = require("../services/auth");

async function handelUserSignup(req, res) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.render("signup", { error: "Email already exists" });
    }

    const hashPassword = await argon2.hash(password);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const token = setUser(user);
    res.cookie("uid", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("signup", {
      error: "Something went wrong. Please try again later",
    });
  }
}

async function handelUserLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.render("login", { error: "Invalid Credentials" });

    if (await argon2.verify(user.password, password)) {
      const token = setUser(user);
      res.cookie("uid", token, { httpOnly: true, secure: true });
      return res.redirect("/");
    }
  } catch (error) {
    return res.render("login", { error: "Invalid Credentials" });
  }
}

async function handelUserContact(req, res) {
  try {
    const { name, email, message, subject } = req.body;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "hisejal28@gmail.com",
      subject: `New Contact Form Submission: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    });

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending mail: ", error);
    res
      .status(500)
      .json({ message: "Failed to send your query. Please try again later." });
  }
}


async function handelUserProfile(req, res) {
  const token = req.cookies?.uid;
  if (!token) return res.redirect("login");

  const user = getUser(token);
  if (!user) return res.redirect("login");
  res.json(user);
}

async function showProducts(req, res) {
  try {
    const artwork = await Product.find();
    res.status(200).json(artwork);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  handelUserSignup,
  handelUserLogin,
  handelUserContact,
  handelUserProfile,
  showProducts
};
