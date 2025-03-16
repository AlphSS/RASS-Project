const mongoose = require("mongoose");

const User = require("../model/user");
const Cart = require("../model/cart");
const Product = require("../model/productSchema");

async function addToCart(req, res) {
  try {
    const { productId } = req.body;
    const userId = req.user;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({
        userId: userId,
        products: [
          {
            productId: productId,
            title: product.title,
            category: product.category,
            imgUrl: product.imgUrl,
          },
        ],
      });
    } else {
      const productExist = cart.products.some((item) =>
        item.productId.equals(productId)
      );
      if (!productExist) {
        await Cart.findOneAndUpdate(
          { userId },
          {
            $addToSet: {
              products: {
                productId: product._id,
                title: product.title,
                category: product.category,
                imgUrl: product.imgUrl,
              },
            },
          }
        );
      }
    }

    res.status(201).json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to add to cart" });
  }
}

async function getCart(req, res) {
  try {
    const { productId } = req.params;
    const userId = req.user;

    const cartItems = await Cart.findOneAndUpdate(
      { userId },
      {
        $pull: {
          products: {
            productId: productId,
          },
        },
      }
    );

    if (!cartItems) return res.status(200).json({ products: [] });

    res.status(200).json({ products: cartItems.products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get cart" });
  }
}

async function deleteCart(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const cartItem = await Cart.findOneAndUpdate(
      { userId: userId },
      {
        $pull: {
          products: {
            productId: new mongoose.Types.ObjectId(id),
          },
        },
      }
    );

    res.status(200).json({ success: true, message: "Item deleted from cart" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete from cart" });
  }
}

module.exports = { addToCart, getCart, deleteCart };
