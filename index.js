const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
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

app.get("/game/:id", (request, response) => {
    if (isNaN(request.params.id)) {
        response.sendStatus(400);
        return;
    }

    var id = parseInt(request.params.id);
    game = DataBase.games.find(game => game.id == id);

    if (game != undefined) {
        response.statuscode = 200;
        response.json(game);
        return;
    }

    response.sendStatus(404);
})

app.post("/game", (request, response) => {
    var { title, year, price } = request.body;
    if (title == undefined || isNaN(year) || isNaN(price)) {
        response.sendStatus(400);
        return;
    }

    DataBase.games.push({
        id: 10,
        title,
        year,
        price
    });

    response.sendStatus(200);
})

app.delete("/game/:id", (request, response) => {
    if (isNaN(request.params.id)) {
        response.sendStatus(400);
        return;
    }

    var id = parseInt(request.params.id);
    index = DataBase.games.findIndex(game => game.id == id);

    if (index != -1) {
        DataBase.games.splice(index, 1);
        response.sendStatus(200);
        return;
    }

    response.sendStatus(404);
})

app.put("/game/:id", (request, response) => {
    if (isNaN(request.params.id)) {
        response.sendStatus(400);
        return;
    }

    var id = parseInt(request.params.id);
    game = DataBase.games.find(game => game.id == id);

    if (game != undefined) {
        var { title, year, price } = request.body;
        if (title != undefined) {
            game.title = title;
        }

        if (!isNaN(year)) {
            game.year = year;
        }

        if (!isNaN(price)) {
            game.price = price;
        }

        response.sendStatus(200);
        return;
    }

    response.sendStatus(404);
})


app.listen(45678, () => {
    console.log('API Rodando')
});