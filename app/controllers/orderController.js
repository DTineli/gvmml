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
        console.log(response.order_items[0].item.id);
        req.connection.query("INSERT INTO contato (fkempresa, situacao, nome, cnpj_cpf) VALUES (1, 'A', ?, '48345694896')", [response.buyer.nickname], (err, dbRes) => {
            if (err) {
                next(err);
            } else {
                req.connection.query("SELECT recnum from contato where cnpj_cpf = 48345694896", (err, cliente) => {
                    if (err) {
                        next(err);
                    }
                    req.connection.query("INSERT INTO mov (recnum, documento, data, fkcontato, fkmovtipo, situacao, fkempresa, fktabpre, total_produtos, total_liquido) VALUES (?, ?, ?, ?, 21, 'R', 1, 1, ?, ? )", [
                        response.id,
                        response.id,
                        new Date(),
                        cliente[0].recnum,
                        response.payments[0].transaction_amount,
                        response.payments[0].transaction_amount,
                    ], (err, insertRes) => {
                        if (err) {
                            //     console.log(err);
                        }
                        req.connection.query("SELECT id_variacao from produtoml WHERE id_ml = ?", [response.order_items[0].item.id], (err, variacao) => {

                            req.connection.query("INSERT INTO movitem (recnum, fkmov, fkvariacao, quantidade, valor) VALUES (?, ?, ?, 1, ?)", [
                                response.id,
                                response.id,
                                variacao[0].id_variacao,
                                response.payments[0].transaction_amount
                            ], (err, itemRes) => {
                                if (err) {
                                    //  console.log(err);
                                }
                                //console.log(itemRes);
                            });
                        });

                    })
                })
            }

        });
        // console.log(response.payments.total_paid_amount);
        res.render('detalheOrderPage', { order: response });
    })

};