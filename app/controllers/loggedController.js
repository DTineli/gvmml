exports.logged = (req, res, next) => {
    console.log(req.session.user_id);
    console.log(req.session.access_token_ml);
    req.connection.query('SELECT access_token FROM userml WHERE user_id = ?',
        [
            req.params.user_id
        ], (err, access_token) => {
            if (err) {
                next(err);
            }
            res.render('loggedPage', { access_token: access_token[0].access_token });
        })
}