exports.GetProduto = (req, res, next) => {
    res.render('procuraProduto');
}

exports.getAnuncio = (req, res, next) => {
    const referencia = req.query.referencia;

    if (referencia) {
        req.connection.query('select p.recnum, descricao, descricao_site, t.valor from produto p left join tabpreitem t on p.recnum = t.fkvariacao where referencia = ? and t.fktabela = ?', [referencia, 2],
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
                            estoque: estoque[0].saldo
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
    console.log(req.body);
}