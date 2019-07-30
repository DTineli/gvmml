const meli = require('../config/meli-factory');

exports.GetProduto = (req, res, next) => {
    res.render('procuraProduto', { access_token: req.query.access_token });
}

exports.getAnuncio = (req, res, next) => {
    const referencia = req.query.referencia;

    if (referencia) {
        req.connection.query('select p.recnum, descricao, descricao_site, round(t.valor, 2) as valor from produto p left join tabpreitem t on p.recnum = t.fkvariacao where referencia = ? and t.fktabela = ?', [referencia, 2],
            (err, produto) => {
                if (err) {
                    next(err);
                }

                if (produto.lengh == 0) {
                    res.render('procuraProduto');
                } else {
                    req.connection.query('SELECT saldo FROM estoque WHERE fkvariacao = ? and fkempresa = 1 ORDER BY data desc LIMIT 1', [produto[0].recnum], (err, estoque) => {
                        res.render('anuncioPage', {
                            titulo: produto[0].descricao,
                            descricao: produto[0].descricao_site,
                            valor: produto[0].valor,
                            estoque: estoque[0].saldo,
                            access_token: req.query.access_token
                        });
                    })
                }

            }
        );
    } else {
        res.render('procuraProduto');
    }
}

exports.postAnuncio = (req, res, next) => {
    meli.post('items', {
        "title": req.body.titulo_anuncio,
        "category_id": "MLB3530",
        "price": req.body.preco,
        "currency_id": "BRL",
        "available_quantity": "1",
        "buying_mode": "buy_it_now",
        "listing_type_id": "free",
        "description": { "plain_text": req.body.descricao },
        "attributes": [{
            "id": "ITEM_CONDITION", "value_id": "2230284"
        }],
        "sale_terms": [{ "id": "WARRANTY_TYPE", "value_id": "2230279" },
        { "id": "WARRANTY_TIME", "value_name": "90 dias" }],
        "pictures": [
            { "source": "https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwjGsIHt0drjAhUVCrkGHQ5_AU0QjRx6BAgBEAU&url=https%3A%2F%2Fwww.editorajuspodivm.com.br%2Fteste&psig=AOvVaw16CaF-k4gTSGrYwmSK5XqI&ust=1564507255157642" }
        ]
    }, { "access_token": req.session.access_token_ml }, (err, response) => {
        if (err) {
            console.log('ERRR');
            console.log(err);
        }
        res.render('produtoCriado', { link: response.permalink })
    });
}