const express = require('express');
const { engine } = require('express-handlebars')
const app = express();
const ModuloAdminRotas = require('./modulos/rotas')
const { db, authenticate } = require('./modulos/db')
const bodyParser = require('body-parser');

//Conexão DB
authenticate();

//Template engine.
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Rotas
app.use('/admin', ModuloAdminRotas) // ( usando prefixo / admin para acessar as rotas. )

app.listen(8081, () => {
   console.log('Servidor rodando...')
})



