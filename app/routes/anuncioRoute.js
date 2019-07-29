const express = require('express');
const anuncioController = require('../controllers/anuncioController');

const router = express.Router();

router.get('/', anuncioController.GetAnuncio);

module.exports = router;
