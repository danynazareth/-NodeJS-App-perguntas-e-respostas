const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');


connection.authenticate().then(()=>{
    console.log('ALL CERTO');
}).catch((msgErro)=>{
    console.log('ERROR');
});

app.set("view engine", 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get("/" ,(req,res)=>{
    Pergunta.findAll({raw:true, order:[['id', 'DESC']]}).then(perguntas =>{
        res.render("index",{ pergunta:perguntas});
    });
   
});


app.get('/perguntar',(req,res)=>{
    res.render('perguntar');
});

app.post('/salvarpergunta',(req,res)=>{
   
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    // res.send("</br>formulario</br> "+ req.body.titulo + "</br>descricao</br> " + descricao);

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect('/');
    });
});


app.get("/pergunta/:id", (req,res)=>{
    var id = req.params.id;
    Pergunta.findOne({
        where:{id:id}
    }).then(pergunta => {
        if(pergunta != undefined){


            Resposta.findAll({
                where:{perguntaId:pergunta.id} ,
                order:[['id','DESC'] ]              
            }).then(respostas =>{
                res.render("pergunta",{
                    pergunta:pergunta,
                    respostas:respostas
                });
            });
           
        }else{
            res.redirect("/");
        }
    });
});


app.post("/responder",(req,res)=>{
    var corpo  = req.body.corpo;
    var perguntaID = req.body.pergunta;

    console.log(corpo+" "+perguntaID)
    Resposta.create({ 
        corpo: corpo,
        perguntaId: perguntaID
    }).then(()=>{
        res.redirect('/pergunta/'+perguntaID);

    });
});

app.listen(8080,()=>{
    console.log("app rodando!");
});