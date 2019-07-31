const express = require('express');

const router = express.Router();

router.get('/', require('../controllers/loggedController').logged);

module.exports = router;