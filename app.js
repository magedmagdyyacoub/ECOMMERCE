const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const { setUser } = require('./middlewares/auth');
const { sequelize, User, Category, Product, Cart } = require('./models');
const pool = require('./config/db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

// Initialize Passport.js
const initializePassport = require('./passport');
initializePassport(passport);

const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// EJS Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session Configuration
app.use(
  session({
    store: new pgSession({
      pool: pool, // PostgreSQL pool instance
      tableName: 'session', // Matches session table name
    }),
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
  })
);

// Use the setUser middleware
app.use(setUser);

// Initialize Passport and Flash
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Import Routes
const indexRoutes = require('./routes/index');

// Use Routes
app.use('/', indexRoutes);
app.use('/products', productRoutes);
app.use('/', authRoutes);
app.use('/adminpanel', adminRoutes);
app.use('/adminpanel/users', userRoutes);
app.use('/adminpanel/categories', categoryRoutes);
app.use('/adminpanel/products', productRoutes);

// Define cartItems variable
let cartItems = [];

// Cart Routes
app.get('/cart', (req, res) => {
  res.render('pages/cart', { cartItems });
});

app.post('/cart/add/:id', (req, res) => {
  const productId = req.params.id;
  const newProduct = {
    id: productId,
    name: `Product ${productId}`,
    price: 100,
    quantity: 1,
  };

  const existingProductIndex = cartItems.findIndex((item) => item.id === productId);
  if (existingProductIndex !== -1) {
    cartItems[existingProductIndex].quantity += 1;
  } else {
    cartItems.push(newProduct);
  }

  res.redirect('/cart');
});

app.get('/cart/remove/:id', (req, res) => {
  const productId = req.params.id;
  cartItems = cartItems.filter((item) => item.id !== productId);
  res.redirect('/cart');
});

// Checkout Routes
app.get('/checkout', (req, res) => {
  res.render('pages/checkout', { cartItems });
});

app.post('/checkout/submit', (req, res) => {
  const { name, address, email, phone } = req.body;
  console.log('Order submitted:', { name, address, email, phone });

  cartItems = [];

  res.render('pages/thank-you', { name });
});

// Contact Routes
app.get('/contact', (req, res) => {
  res.render('pages/contact', { title: 'Contact Us' });
});

app.post('/contact/submit', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Contact Form Submitted:', { name, email, message });
  res.redirect('/contact');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).render('pages/error', { error: err });
});

// Sync Sequelize models with the database
sequelize.sync().then(() => {
  // Start Server
  app.listen(port, () => {
    console.log(`E-commerce app running on http://localhost:${port}`);
  });
});
