const express = require('express');
const ordersController = require('../controllers/orderController');

const router = express.Router();

router.get('/', ordersController.getOrders);
router.get('/:order_id', ordersController.getOrder);

module.exports = router;