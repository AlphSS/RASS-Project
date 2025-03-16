const cloudinary = require("../config/cloudainary");

const Admin = require("../model/admin");
const Product = require("../model/productSchema");
const User = require("../model/user");
const Cart = require("../model/cart");

const argon2 = require("argon2");
const { setUser } = require("../services/auth");

async function handelAdminSignup(req, res) {
  try {
    const { name, mobile, email, password } = req.body;

    const hashPassword = await argon2.hash(password);

    const admin = await Admin.create({
      name,
      mobile,
      email,
      password: hashPassword,
    });

    const token = setUser(admin);
    res.cookie("uid", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.redirect("/adminlogin");
  } catch (error) {
    return res.render("adminSignup", { error: "Mobile number already exists" });
  }
}

async function handelAdminLogin(req, res) {
  try {
    const { mobile, password } = req.body;
    const admin = await Admin.findOne({ mobile });

    if (!admin) {
      return res.render("adminlogin", { error: "Unauthorized" });
    }

    const isPasswordValid = await argon2.verify(admin.password, password);

    if (!isPasswordValid) {
      return res.render("adminlogin", { error: "Invalid Credentials" });
    }

    const token = setUser(admin);

    res.cookie("uid", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.render("adminlogin", { error: "Something went wrong!" });
  }
}

async function addProduct(req, res) {
  const { title, productId, category } = req.body;
  const file = req.file.path;

  const result = await cloudinary.uploader.upload(file, {
    folder: "RASS_Products",
  });

  try {
    const existingProduct = await Product.findOne({ productId });

    if (existingProduct) {
      return res.render("addProduct", { error: "Product already exists" });
    }

    const product = await Product.create({
      title: title,
      productId: productId,
      imgUrl: result.secure_url,
      category: category,
    });

    return res.redirect("/upl");
  } catch (error) {
    console.log(error);
    return res.render("addProduct", { error: "Something went wrong!" });
  }
}

async function getArtworks(req, res) {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failsed to load artworks" });
  }
}

async function deleteArtwork(req, res) {
  try {
    const { id } = req.params;
    const artwork = await Product.findById(id);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork Not Found" });
    }

    const imageUrl = artwork.imgUrl;
    const publicId = `RASS_Products${
      imageUrl.split("/RASS_Products")[1].split(".")[0]
    }`;
    console.log(publicId);

    await cloudinary.api
      .delete_resources([publicId], { type: "upload", resource_type: "image" })
      .then(console.log);

    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Artwork Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to Delete" });
  }
}

async function allUsers(req, res) {
  try {
    const users = await User.find();
    const userWithCart = await Promise.all(
      users.map(async (user) => {
        const cart = await Cart.findOne({ userId: user._id });
        return { user, cart: cart ? cart.products : [] };
      })
    );
    res.json(userWithCart);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

module.exports = {
  handelAdminSignup,
  handelAdminLogin,
  addProduct,
  getArtworks,
  deleteArtwork,
  allUsers
};
