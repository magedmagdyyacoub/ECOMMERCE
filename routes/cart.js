const express = require("express");
const { Cart, Product, Order } = require("../models");
const { ensureAuthenticated } = require("../middlewares/auth");
const router = express.Router();

// Add product to cart
router.post("/add/:id", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const cartItem = await Cart.findOne({ where: { userId, productId } });

    if (cartItem) {
      await cartItem.increment("quantity", { by: 1 });
    } else {
      await Cart.create({ userId, productId, quantity: 1 });
    }

    res.redirect("/cart");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// View cart
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.findAll({
      where: { userId },
      include: Product,
    });

    // Retrieve the user's pending order (if any)
    const order = await Order.findOne({ where: { userId, status: "pending" } });

    res.render("pages/cart", { cartItems, order });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Remove product from cart
router.post("/remove/:id", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    await Cart.destroy({ where: { userId, productId } });
    res.redirect("/cart");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
