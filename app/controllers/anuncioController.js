const meli = require('../config/meli-factory');

exports.GetProduto = (req, res, next) => {
    res.render('procuraProduto');
}

exports.getAnuncio = (req, res, next) => {
    const referencia = req.query.referencia;

    if (referencia) {
        req.connection.query('select p.recnum, descricao, descricao_site, round(t.valor, 2) as valor from produto p left join tabpreitem t on p.recnum = t.fkvariacao where referencia = ? and t.fktabela = ?', [referencia, req.query.tabela],
            (err, produto) => {
                if (err) {
                    next(err);
                }

                if (produto == 0) {
                    res.render('procuraProduto');
                } else {
                    req.connection.query('SELECT saldo FROM estoque WHERE fkvariacao = ? and fkempresa = 1 ORDER BY data desc LIMIT 1', req.query.variacao, (err, estoque) => {
                        res.render('anuncioPage', {
                            titulo: produto[0].descricao,
                            descricao: produto[0].descricao_site,
                            valor: produto[0].valor,
                            estoque: estoque[0].saldo,
                            access_token: "",
                            variacao: req.query.variacao
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

        req.connection.query('INSERT INTO produtoml (id_ml, id_variacao) VALUES (?, ?)', [response.id, req.body.variacao], (err, responseProduto) => {
            console.log(err);
            res.render('produtoCriado', { link: response.permalink });
        });
    });
}

exports.getVariacao = (req, res, next) => {
    const referencia = req.params.referencia;

    if (referencia) {
        req.connection.query('SELECT recnum FROM produto where referencia = ?', [referencia], (err, produto) => {
            if (err) {
                return next(err);
            }

            if (produto == 0) {
                res.send({ data: ['produto não encontrado'] })
            } else {
                req.connection.query("SELECT recnum, fkdetalhe from variacao where fkproduto = ? and situacao = 'A'", [produto[0].recnum], (err, variacao) => {
                    res.send(variacao);
                });
            }

        })
    }

}