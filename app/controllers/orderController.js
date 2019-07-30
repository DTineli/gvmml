const meli = require('../config/meli-factory');

exports.getOrders = (req, res, next) => {

    meli.get('orders/search', {
        "seller": req.session.user_id,
        "order.status": "paid",
        "access_token": req.session.access_token_ml
    },
        (err, response) => {
            if (err) {
                console.log('err');
                console.log(err);
                next(err);
            }
            res.render('ordersPage', { orders: response.results });
        });

}

exports.getOrder = (req, res, next) => {
    meli.get('/orders/' + req.params.order_id, {
        "access_token": req.session.access_token_ml
    }, (err, response) => {
        if (err) {
            next(err);
        }
        console.log(response);
        res.render('detalheOrderPage', { order: response });
    })

};