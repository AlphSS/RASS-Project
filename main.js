const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const { connectDB } = require("./config/DBconnect");
const { checkForAuthentication, restrictTo } = require("./middleware/auth");

const staticRoute = require("./routes/staticRoute");
const userRoute = require("./routes/userRoute");
const adminStaticRoute = require("./routes/adminStaticRoute");
const adminRoute = require("./routes/adminRoute");
const cartRoute = require("./routes/cartRoute");

const app = express();
const port = process.env.PORT;

connectDB();

app.set("view engine", "ejs");
app.set("views", path.resolve("./view"));

app.use(cookieParser());
app.use(express.json());
app.use(checkForAuthentication);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("./public")));

app.use("/", staticRoute);
app.use("/user", userRoute);
app.use("/", adminStaticRoute);
app.use("/admin", adminRoute);
app.use("/cart", cartRoute);

app.listen(port, () => {
  console.log("http://localhost:3000/")
  console.log(`Server is running on port ${port}`);
});
