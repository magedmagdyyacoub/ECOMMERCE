const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51PfQr5AJVDaohswD...'); // Replace with your Secret Key
const { Order, OrderItem } = require('../models'); 

// Get checkout page
router.get('/checkout', async (req, res) => {
  try {
    const orderId = req.query.orderId;

    if (!orderId) {
      return res.status(400).send('Order ID is required');
    }

    const order = await Order.findOne({
      where: { id: orderId },
      include: [{ model: OrderItem, as: 'items' }]
    });

    if (!order) {
      return res.status(404).send('Order not found');
    }

    res.render('pages/checkout', { order, cartItems: order.items });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).send('Error fetching order');
  }
});

// Handle payment
router.post('/checkout/payment', async (req, res) => {
  const { name, address, email, phone, cartItems, orderId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Replace with actual amount
      currency: 'usd',
      payment_method_types: ['card'],
    });

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).send('Order not found');
    }

    // Update order details
    await order.update({
      name,
      address,
      email,
      phone,
      total_amount: 1000, // Replace with actual total amount
      payment_status: 'completed'
    });

    res.json({ client_secret: paymentIntent.client_secret, orderId: order.id });
  } catch (error) {
    console.error('Payment failed:', error);
    res.status(500).send('Payment failed');
  }
});

// Create payment intent
router.post('/checkout/payment-intent', async (req, res) => {
  try {
    const { totalAmount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Convert to cents
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send('Error creating payment intent');
  }
});

module.exports = router;
