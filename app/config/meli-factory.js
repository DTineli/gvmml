const config = require('../config/config');

const objMeli = require('mercadolibre');

const meli = new objMeli.Meli(config.client_id, config.secret_key, config.redirect_uri);

module.exports = meli; 