const express = require("express");
const app = express();
const bodyParser = require('body-parser'); //Traduz os dados recebidos no front em uma estrutura javascript. Responsável por receber dados no NODEJS dos formulários recebidos 
const connection = require('./database/database'); //Recebendo minha conexão do meu banco de dados via outro arquivo. (Exportação)
const perguntaModel = require('./database/Pergunta'); //Importo a minha tabela 
const respostaModel = require('./database/Resposta');

/*DataBase*/
connection
    .authenticate() //Faço a conexão e passo uma tentativa caso a conexão seja feita com sucesso, e um error caso não seja
    .then(() => {
        console.log('Conexão feita com o banco de dados.')
    })
    .catch((msgError) =>{
        console.error('Conexão com o banco de dados não estabelecida.', msgError)
    })

//Estou dizendo ao Express usar EJS como View Engine
/*
Tag especial do EJS: <%= %>
Utilizada para exibir variáveis JS em HTML
*/
app.set('view engine', 'ejs');

//Estou dizendo para o Express usar essa referência para arquivos estáticos (css, imagens, javascript front end)
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false})) //Traduz os dados recebidos no front em uma estrutura javascript.
app.use(bodyParser.json());

/* Minhas Rotas */
app.get("/", function(req, res){ //Rota página principal
    perguntaModel.findAll({raw: true /*Faz uma pesquisa crua*/, order:[ ["id","DESC"] /*Faço uma ordenação com base na coluna id*/]}) //Responsável por procurar todas as perguntas listadas na tabela e exibir. Equivalente ao SELECT * FROM pergunta
    .then((perguntas)=>{ //Caso dê certo acontece alguma coisa.
        let arquivo = "C:/Users/ACER/Desktop/NODEJS/GuiaPerguntas/views/index.ejs"
        res.render(arquivo,{
            pergunta: perguntas, 
        });
    }) 
});
app.get("/sendask",function(req, res){
    let pagPerguntar = "C:/Users/ACER/Desktop/NODEJS/GuiaPerguntas/views/perguntar.ejs";
    res.render(pagPerguntar);
});

app.post("/saveask", (req, res) => { //Método utilizado somente para receber dados de formulários.
    var titulo = req.body.titulo;
    var descricao = req.body.descriacao;

    perguntaModel.create({ //Referente ao INSERT INTO perguntas ... Pergunta
        titulo: titulo,
        descricao: descricao,
    }).then(() => { //Caso a tabela for criada com sucesso, redireciono o meu cliente para a página principal.
        res.redirect("/")
        //alert('Pergunta enviada com sucesso!')
    }).catch((error)=>{
        console.error('Ocorreu um erro com o envio da pergunta', error)
        //alert('Ocorreu um erro com o envio do formulario!')
    }); 
});

app.get("/ask/:id", (req, res) => { //Rota para acessar uma pergunta com base em seu id
    var id = req.params.id
    
    perguntaModel.findOne({     //Método do Sequelize que vai buscar apenas uma informação no banco de dados.
        where: {id: id}   
    }).then(pergunta => {
        if(pergunta != undefined){

            respostaModel.findAll({ raw: true /*Faz uma pesquisa crua*/, order:[ ["id","DESC"] ],
                where: {perguntaId: pergunta.id}
            }).then((respostas)=>{
               res.render("exibirPergunta", {
                pergunta: pergunta, /*Mando uma variável para ser trabalhada na página*/
                respostas: respostas
                })  
            })

        }else {
            res.redirect("/")
        }
    }) 
})

app.post("/answer", (req, res) => { //Rota de resposta da pergunta.
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    
    respostaModel.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect("/ask/"+perguntaId)
    }).catch((error)=>{
        console.error('Ocorreu um erro com o envio da resposta', error)
    })
})

//Hospedagem local da aplicação
app.listen(8080, () => {
    console.log("App rodando!");
});































//<%- include('partials'/header.ejs); %>

//npm install --save sequelize / npm install --save mysql2