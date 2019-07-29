exports.logged = (req, res, next) => {
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