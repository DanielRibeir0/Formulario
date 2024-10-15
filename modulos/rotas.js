const express = require("express");
const rotas = express();
const patch = require('path')
const bodyParser = require('body-parser')
const usuarios = require('./posts');
const Sequelize = require('sequelize'); // Importando o Sequelize
const { Op } = Sequelize; // Extraindo Op do Sequelize

rotas.use(bodyParser.urlencoded({ extended: true }));
rotas.get('/home', (req, res) => {
  res.render('formulario')
});

rotas.get('/index', async (req, res) => {
  const users = await usuarios.findAll()
  res.render('index', { users: users.map(user => user.toJSON()) });
})

rotas.get('/deletar/:id', async (req, res) => {
  await usuarios.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/index')
})

rotas.get('/editar/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const usuario = await usuarios.findByPk(id); // Busca o usuário pelo ID

      if (usuario) {
        res.render('editar', { usuario: usuario.toJSON() }); // Passando dados do usuário para o template
      } else {
        res.status(404).send('Usuário não encontrado');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao acessar o banco de dados');
    }
});

rotas.post('/editar/:id', async (req, res) => {
      const { id } = req.params;
      const { nome, email, senha } = req.body;
      const usuario = await usuarios.findByPk(id); // Busca o usuário pelo ID
      
    if (nome != '') {
      
      try {
        await usuarios.update({ nome, email, senha }, { where: { id } });
        res.send('Usuário atualizado com sucesso!');
      } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao atualizar usuário');
      }
    }else {
      // Renderiza a página apenas uma vez com a mensagem e os dados do usuário
      res.render('editar', { 
        mensagem: 'Todos os campos precisam estar preenchidos.',   
          usuario: usuario ? usuario.toJSON() : null // Verifica se o usuário existe
      });
  }
      
});

//  cria novos usuarios... 
rotas.post('/add', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (nome && email && senha) {
    try {
      const usuario = await usuarios.create({
        nome: nome,
        email: email,
        senha: senha
      });
      console.log('Usuário criado com sucesso:', usuario);
      res.redirect('/admin/home');
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      res.status(500).send('Erro ao criar usuário');
    }
  } else {
      res.render('editar', { 
      mensagem: 'Todos os campos precisam estar preenchidos.',  
  });
  }
});

//  Pesquisa , verifica no db. retorna para pagina handlebars 
rotas.post('/search', async (req, res) => {
const searchQuery = req.body.search;
console.log('Busca realizada:', searchQuery);

    if(searchQuery ==''){
      res.render('index', { mensagem: 'Campo vazio, necessario preenchimento' });

    }

  // Busca o usuário pelo nome
  const usuario = await usuarios.findOne({
    where: {
      [Op.or]: [
        { nome: searchQuery }, // Busca pelo nome ou
        { email: searchQuery } // Busca pelo e-mail
      ]
    }
  });

  // Verifica se o usuário foi encontrado
  if (usuario) {
    res.render('editar', { usuario: usuario.toJSON() }); // Passando dados do usuário para o template
  }
  else {
    res.render('index', { mensagem: 'Nenhum usuário encontrado.' });
  }
  });

module.exports = rotas;