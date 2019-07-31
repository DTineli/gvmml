const express = require('express');
const anuncioController = require('../controllers/anuncioController');

const router = express.Router();

router.get('/produto', anuncioController.GetProduto);
router.get('/produto/:referencia', anuncioController.getVariacao);
router.get('/', anuncioController.getAnuncio);
router.post('/postAnuncio', anuncioController.postAnuncio);

module.exports = router;
