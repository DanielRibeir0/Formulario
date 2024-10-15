const Sequelize = require('sequelize')
const sequelize = new Sequelize('cadastro', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
})

function authenticate() {
    sequelize.authenticate().then(() => {
        console.log('conexao realizada com sucesso')
    }).catch((erro) => {
        console.log('banco não conectado' + erro)
    })
}

module.exports = {
    sequelize,
    authenticate,
}; 