const express = require('express');

const router = express.Router();

router.get('/:user_id', require('../controllers/loggedController').logged);

module.exports = router;