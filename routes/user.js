const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get all users
router.get('/', async (req, res) => {
    const users = await User.findAll();
    res.render('pages/admin/user/users', { users });
});

// Add a new user
router.post('/add', async (req, res) => {
    const { username, password, role } = req.body;
    await User.create({ username, password, role });
    res.redirect('/adminpanel/users');
});

// Edit a user
router.get('/edit/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    res.render('pages/admin/user/editUser', { user });
});

router.post('/edit/:id', async (req, res) => {
    const { username, password, role } = req.body;
    await User.update({ username, password, role }, { where: { id: req.params.id } });
    res.redirect('/adminpanel/users');
});

// Delete a user
router.get('/delete/:id', async (req, res) => {
    await User.destroy({ where: { id: req.params.id } });
    res.redirect('/adminpanel/users');
});

module.exports = router;
