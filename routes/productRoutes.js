const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Get all products with pagination
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 7;
    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
        include: Category,
        limit,
        offset
    });

    const totalPages = Math.ceil(count / limit);
    const categories = await Category.findAll();

    res.render('pages/admin/product/products', { products, categories, page, totalPages });
});

// Show product details
router.get('/show/:id', async (req, res) => {
    const product = await Product.findByPk(req.params.id, { include: Category });
    res.render('pages/admin/product/showProduct', { product });
});

// Add a new product
router.post('/add', upload.single('image'), async (req, res) => {
    const { name, description, price, categoryId } = req.body;
    const image = req.file ? req.file.filename : 'default.png';
    await Product.create({ name, description, price, image, categoryId });
    res.redirect('/adminpanel/products');
});

// Edit a product
router.get('/edit/:id', async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    const categories = await Category.findAll();
    res.render('pages/admin/product/editProduct', { product, categories });
});

router.post('/edit/:id', upload.single('image'), async (req, res) => {
    const { name, description, price, categoryId } = req.body;
    const image = req.file ? req.file.filename : req.body.existingImage;
    await Product.update({ name, description, price, image, categoryId }, { where: { id: req.params.id } });
    res.redirect('/adminpanel/products');
});

// Delete a product
router.get('/delete/:id', async (req, res) => {
    await Product.destroy({ where: { id: req.params.id } });
    res.redirect('/adminpanel/products');
});

module.exports = router;
