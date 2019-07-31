const meli = require('../config/meli-factory');
const config = require('../config/config');

exports.getAuth = (req, res, next) => {
    let code;
    if (code = req.query.code) {
        meli.authorize(code, config.redirect_uri, (err, response) => {
            if (err) {
                console.log('err');
                return next(err);
            }

            req.session.user_id = response.user_id;
            req.session.access_token_ml = response.access_token;

            res.redirect('/logged');

        });
    } else {
        res.redirect('/');
    }
}