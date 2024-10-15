const Sequelize = require('sequelize')
const { sequelize, authenticate } = require('./db');

const usuarios = sequelize.define('cadastro', {  
    nome: {
        type: Sequelize.STRING, 
        allowNull: false
    },
    email: {
        type: Sequelize.STRING, 
        allowNull: false,
        unique: true
    },
    senha: {
        type: Sequelize.STRING, 
        allowNull: false
    }
}
);
module.exports = usuarios;