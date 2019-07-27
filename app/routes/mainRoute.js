const express = require('express');

const meli = require('../config/meli-factory');
const config = require('../config/config');

const router = express.Router();

router.get('/', (req, res) => {

    res.render('mainPage', { authUrl: meli.getAuthURL(config.redirect_uri) });
});

module.exports = router;