const Sequelize = require('sequelize');

//Nome do meu banco de dados, usuário e senha do banco de dados.
const connection = new Sequelize('guiaperguntas', 'root', '16031997', {
    host: 'localhost', //Servidor que está acontecendo o meu MySQL
    dialect: 'mysql' //Tipo de banco que quero me conectar.
});

module.exports = connection