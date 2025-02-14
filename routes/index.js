const express = require("express");
const router = express.Router();
const { sequelize, Category, Product, CartItem } = require("../models");

// Home Page
router.get("/", async (req, res) => {
  const user = req.user || null; // Default to null if no user is logged in
  try {
    const categories = await Category.findAll({
      limit: 4,
      include: [{ model: Product, attributes: [] }],
      group: ["Category.id"]
    });
    const justArrivedProducts = await Product.findAll({
      limit: 8,
      order: [['createdAt', 'DESC']]
    });
    const mostSellingProducts = await Product.findAll({
      limit: 8,
      order: sequelize.random()
    });
    res.render("pages/home", { user, categories, justArrivedProducts, mostSellingProducts, title: "Home" });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Home Page for Logged-in Users
router.get("/home", async (req, res) => {
  const user = req.user || null; // Default to null if no user is logged in
  try {
    const categories = await Category.findAll({
      limit: 4,
      include: [{ model: Product, attributes: [] }],
      group: ["Category.id"]
    });
    const justArrivedProducts = await Product.findAll({
      limit: 8,
      order: [['createdAt', 'DESC']]
    });
    const mostSellingProducts = await Product.findAll({
      limit: 8,
      order: sequelize.random()
    });
    res.render("pages/home", { user, categories, justArrivedProducts, mostSellingProducts, title: "Home" });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// More Categories Page
router.get("/more-categories", async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const categories = await Category.findAll({
      limit: 4,
      offset: offset,
      include: [{ model: Product, attributes: [] }],
      group: ["Category.id"]
    });
    res.render("pages/moreCategories", { categories, offset: offset + 4, title: "More Categories" });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Category Products Page
router.get("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product }]
    });
    res.render("pages/categoryProducts", { category, title: category.name });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// All Products Page
router.get("/products", async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const products = await Product.findAll({
      limit: 12,
      offset: offset,
      order: [['createdAt', 'DESC']]
    });
    res.render("pages/products", { products, offset: offset + 12, title: "All Products" });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Product Details Page
router.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }]
    });
    res.render("pages/productDetails", { product, title: product.name });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Add Product to Cart
router.post("/cart/add/:id", async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id;
  const product = await Product.findByPk(productId);

  if (product) {
    const cartItem = await CartItem.findOne({ where: { userId, productId } });
    if (cartItem) {
      cartItem.quantity += 1;
      await cartItem.save();
    } else {
      await CartItem.create({ userId, productId, quantity: 1 });
    }
    res.redirect("/cart");
  } else {
    res.status(404).send("Product not found");
  }
});

// Increase Quantity
router.post("/cart/increase/:id", async (req, res) => {
  const cartItemId = req.params.id;
  const cartItem = await CartItem.findByPk(cartItemId);

  if (cartItem) {
    cartItem.quantity += 1;
    await cartItem.save();
    res.redirect("/cart");
  } else {
    res.status(404).send("Cart item not found");
  }
});

// Decrease Quantity
router.post("/cart/decrease/:id", async (req, res) => {
  const cartItemId = req.params.id;
  const cartItem = await CartItem.findByPk(cartItemId);

  if (cartItem) {
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await cartItem.save();
    } else {
      await cartItem.destroy();
    }
    res.redirect("/cart");
  } else {
    res.status(404).send("Cart item not found");
  }
});

// Remove Product from Cart
router.post("/cart/remove/:id", async (req, res) => {
  const cartItemId = req.params.id;
  const cartItem = await CartItem.findByPk(cartItemId);

  if (cartItem) {
    await cartItem.destroy();
    res.redirect("/cart");
  } else {
    res.status(404).send("Cart item not found");
  }
});

// Cart Page
router.get("/cart", async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    
    if (!userId) {
      return res.redirect("/login"); // Redirect to login if user is not authenticated
    }

    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [{ model: Product }]
    });

    const order = null; // Define order variable to prevent ReferenceError

    res.render("pages/cart", { cartItems, order });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).send("Internal Server Error");
  }
});
// Checkout Page
router.get("/checkout", async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.redirect("/login"); // Redirect if not logged in
    }

    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [{ model: Product }]
    });

    if (cartItems.length === 0) {
      return res.redirect("/cart"); // Redirect if cart is empty
    }

    res.render("pages/checkout", { cartItems, user: req.user });
  } catch (error) {
    console.error("Error loading checkout page:", error);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
