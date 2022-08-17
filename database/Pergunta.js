const Sequelize = require('sequelize'); //Conexão com o Sequelize
const connection = require("./database"); //Conexão com o banco de dados

//Definição de model/tabela.
const Pergunta = connection.define('pergunta', {
    titulo: {
        type: Sequelize.STRING, //Definição do tipo de um dado, STRING para dados de caracteres curtos.
        allowNull: false, //Não permito NUNCA que esse meu dado fique vazio no meu banco de dados.
    },
    descricao: {
        type: Sequelize.TEXT, //Definição do tipo de um dado, TEXT para dados de caracteres longos.
        allowNull: false,
    }
});

Pergunta.sync({force: false}).then(() => {});
/*
.sync -> Vai sincronizar o meu json criado nesse arquivo com o banco de dados.

force:false -> Ele não força a criação de uma tabela se já existir uma.
*/

module.exports = Pergunta;