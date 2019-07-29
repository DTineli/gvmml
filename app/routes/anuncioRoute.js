const express = require('express');
const anuncioController = require('../controllers/anuncioController');

const router = express.Router();

router.get('/produto', anuncioController.GetProduto);
router.get('/', anuncioController.getAnuncio);


module.exports = router;
