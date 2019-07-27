const path = require('path');

const express = require('express');

const pool = require('./app/config/pool-factory');
const connectionMeddleware = require('./app/middlewares/connection-middleware');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.static(path.join(__dirname + '/app', 'public')));
app.use(connectionMeddleware(pool));

//ROTAS
app.use('/', require('./app/routes/mainRoute'));
app.use('/auth', require('./app/routes/authRoute'));
app.use('/logged', require('./app/routes/loggedRoute'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.toString() });
});

app.listen(3000, () => {
    console.log('server up');
});