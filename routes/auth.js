const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const passport = require('passport');
const { ensureAuthenticated } = require('../middlewares/auth');
const { Category, Product, sequelize } = require('../models');
const router = express.Router();

// Register Page
router.get('/register', (req, res) => res.render('pages/register', { errors: [] }));

// Register Handle
router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    const errors = [];

    // Validation
    if (!username || !email || !password || !confirmPassword) {
        errors.push('All fields are required.');
    }
    if (password !== confirmPassword) {
        errors.push('Passwords do not match.');
    }
    if (password.length < 6) {
        errors.push('Password must be at least 6 characters.');
    }

    if (errors.length > 0) {
        return res.render('pages/register', { errors });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
            [username, email, hashedPassword]
        );

        req.flash('success_msg', 'You are now registered and can log in.');
        res.redirect('/login');
    } catch (err) {
        console.error(err.message);
        errors.push('Something went wrong. Please try again.');
        res.render('pages/register', { errors });
    }
});

// Login Page
router.get('/login', (req, res) => res.render('pages/login', { errors: [] }));

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            req.flash('error_msg', info.message);
            return res.redirect('/login');
        }

        req.logIn(user, (err) => {
            if (err) return next(err);

            if (user.role === 'admin') {
                return res.redirect('/adminpanel');
            } else {
                return res.redirect('/home');
            }
        });
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success_msg', 'You are logged out.');
        res.redirect('/');
    });
});

// Dashboard
router.get('/home', ensureAuthenticated, async (req, res) => {
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
        res.render("pages/home", { user: req.user, categories, justArrivedProducts, mostSellingProducts, title: "Home" });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
