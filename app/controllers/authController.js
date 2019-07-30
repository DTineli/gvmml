const meli = require('../config/meli-factory');
const config = require('../config/config');

exports.getAuth = (req, res, next) => {
    let code;
    let user_id;
    if (code = req.query.code) {
        meli.authorize(code, config.redirect_uri, (err, response) => {
            if (err) {
                console.log('err');
                return next(err);
            }
            user_id = response.user_id;
            req.connection.query('SELECT * from userml WHERE user_id = ?',
                [user_id],
                (err, user) => {
                    if (err) {
                        return next(err);
                    }
                    if (user.length == 0) {
                        req.connection.query('INSERT INTO userml (user_id, access_token, refresh_token) VALUES (?,?,?)',
                            [user_id,
                                response.access_token,
                                response.refresh_token], (err, results) => {
                                    if (err) {
                                        next(err);
                                    }
                                    req.session.user_id = response.user_id;
                                    req.session.access_token_ml = response.access_token;
                                    res.redirect('/logged/' + user_id);
                                })
                    } else {

                        meli.get('users/me', { access_token: user[0].access_token }, (err, response) => {
                            if (err) {
                                next(err);
                            }
                            if (response.message === 'invalid_token') {
                                meli.refreshAccessToken((err, response) => {
                                    if (err) {
                                        next(err);
                                    }
                                    req.session.user_id = response.user_id;
                                    req.session.access_token_ml = response.access_token;
                                    req.connection.query('UPDATE userml SET access_token = ?, refresh_token = ? WHERE user_id = ?',
                                        [response.access_token, response.refresh_token, user_id], (err, response) => {
                                            if (err) {
                                                console.log(err);
                                                next(err);
                                            }
                                        })
                                })
                            }
                        });
                        req.session.user_id = response.user_id;
                        req.session.access_token_ml = response.access_token;
                        res.redirect('/logged/' + user_id);
                    }

                })

        });
    }

    // 
}