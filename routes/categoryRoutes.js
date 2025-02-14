const express = require('express');
const router = express.Router();
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

// Get all categories
router.get('/', async (req, res) => {
    const categories = await Category.findAll();
    res.render('pages/admin/category/categories', { categories });
});

// Add a new category
router.post('/add', upload.single('image'), async (req, res) => {
    const { name } = req.body;
    const image = req.file ? req.file.filename : 'default.png';
    await Category.create({ name, image });
    res.redirect('/adminpanel/categories');
});

// Edit a category
router.get('/edit/:id', async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    res.render('pages/admin/category/editCategory', { category });
});

router.post('/edit/:id', upload.single('image'), async (req, res) => {
    const { name } = req.body;
    const image = req.file ? req.file.filename : req.body.existingImage;
    await Category.update({ name, image }, { where: { id: req.params.id } });
    res.redirect('/adminpanel/categories');
});

// Delete a category
router.get('/delete/:id', async (req, res) => {
    await Category.destroy({ where: { id: req.params.id } });
    res.redirect('/adminpanel/categories');
});

module.exports = router;
