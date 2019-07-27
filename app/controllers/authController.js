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

            req.connection.query('SELECT * from userml WHERE user_id = ?',
                [response.user_id],
                (err, user) => {
                    if (err) {
                        return next(err);
                    }
                    if (user.length == 0) {
                        req.connection.query('INSERT INTO userml (user_id, access_token, refresh_token) VALUES (?,?,?)',
                            [response.user_id,
                            response.access_token,
                            response.refresh_token], (err, results) => {
                                if (err) {
                                    next(err);
                                }
                                res.redirect('/logged/' + response.user_id);
                            })
                    } else {
                        res.redirect('/logged/' + response.user_id);
                    }

                })

        });
    }

    // 
}