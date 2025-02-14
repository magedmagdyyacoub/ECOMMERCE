const express = require('express');
const { ensureAdmin } = require('../middlewares/auth');
const userRoutes = require('./user');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const router = express.Router();

// Admin Panel Route
router.get('/', ensureAdmin, (req, res) => {
    res.render('pages/admin/adminpanel');
});

// Logout Route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// User Management Route
router.use('/users', userRoutes);
// Category Management Route
router.use('/categories', categoryRoutes);
// Product Management Route
router.use('/products', productRoutes);

module.exports = router;
