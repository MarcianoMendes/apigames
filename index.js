const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var DataBase = {
    games: [
        {
            id: 23,
            title: 'Call of duty',
            year: 2014,
            price: 20
        },
        {
            id: 24,
            title: 'Sea of Tieves',
            year: 2018,
            price: 60
        },
        {
            id: 25,
            title: 'minecraft',
            year: 2012,
            price: 78
        }
    ],
}

app.get("/games", (request, response) => {
    response.statuscode = 200;
    response.json(DataBase.games);
});

app.get("/game/:id",(request,response) => {
    if(isNaN(request.params.id)){
        response.sendStatus(400);
        return;
    }

    var id = parseInt(request.params.id);
    game = DataBase.games.find(game => game.id == id);

    if(game != undefined){
        response.statuscode = 200;
        response.json(game);
        return;
    }

    response.sendStatus(404);
})

app.listen(45678, () => {
    console.log('API Rodando')
});