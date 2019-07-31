exports.logged = (req, res, next) => {
    console.log(req.session.user_id);
    console.log(req.session.access_token_ml);

    if (!req.session.access_token_ml) {
        res.redirect('/');
    } else {
        res.render('loggedPage');
    }

}