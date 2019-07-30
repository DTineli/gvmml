const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);

const pool = require('./app/config/pool-factory');
const connectionMeddleware = require('./app/middlewares/connection-middleware');
const sessionStore = new MysqlStore(require('./app/config/configDB'));

const app = express();

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + '/app', 'public')));
app.use(connectionMeddleware(pool));
app.use(session({
    key: "Init",
    secret: 'gvm',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));


//ROTAS
app.use('/', require('./app/routes/mainRoute'));
app.use('/auth', require('./app/routes/authRoute'));
app.use('/logged', require('./app/routes/loggedRoute'));
app.use('/anuncio', require('./app/routes/anuncioRoute'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.toString() });
});

app.listen(3000, () => {
    console.log('server up');
});