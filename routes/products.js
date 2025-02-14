const express = require("express");
const router = express.Router();

// Products Page
router.get("/", (req, res) => {
  const products = [
    { id: 1, name: "Product 1", price: 100, image: "/images/product1.jpg" },
    { id: 2, name: "Product 2", price: 150, image: "/images/product2.jpg" },
  ];
  res.render("pages/product", { title: "Products - E-Shopper", products });
});

// Product Details Page
router.get("/:id", (req, res) => {
  const product = { id: req.params.id, name: "Product 1", price: 100, description: "This is a great product." };
  res.render("pages/product-detail", { title: "Product Details", product });
});

module.exports = router;
