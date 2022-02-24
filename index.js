const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const jsonwebtoken = require('jsonwebtoken');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var jwtSecret = "fskfjsflsfsfsrwetskslgçsdgsgçs~gsgw9trw_";

function auth(request, response, next) {
    const authtoken = request.headers['authorization'];
    if (authtoken != undefined) {
        const bearer = authtoken.split(' ');
        var token = bearer[1];
        jsonwebtoken.verify(token, jwtSecret, (error, data) => {
            if (error) {
                response.status(401);
                response.json({ err: "Token inválido" });
                return;
            }

            request.token = token;
            request.loggedUser = { id: data.id, email: data.email };
            console.log(data);
            next();
        });

        return;
    }

    response.sendStatus = 401;
    response.json({ err: "Token inválido" });
}

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
    users: [
        {
            id: 1,
            name: 'joao',
            email: 'joao@joao.com',
            password: 'joao123'
        },
        {
            id: 2,
            name: 'maria',
            email: 'maria@maria.com',
            password: 'maria123'
        }
    ]
}

app.get("/games", auth, (request, response) => {
    response.statuscode = 200;
    response.json(DataBase.games);
});

app.get("/game/:id", auth, (request, response) => {
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
});

app.post("/game", auth, (request, response) => {
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
});

app.delete("/game/:id", auth, (request, response) => {
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
});

app.put("/game/:id", auth, (request, response) => {
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
});

app.post("/auth", (request, response) => {
    var { email, password } = request.body;
    if (email == undefined) {
        response.status(400);
        response.json({ err: "E-mail enviado é inválido!" });
        return;
    }

    user = DataBase.users.find(user => user.email == email);    
    if (user != undefined) {
        if (password == user.password) {
            jsonwebtoken.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: "24h" }, (err, token) => {
                if (err) {
                    response.status(400);
                    response.json({ err: "Falha interna!" });
                    return;
                }

                response.json({ token: token });
                response.status(200);
            });

            return;
        }

        response.status(401);
        response.json({ err: "Credenciais Inválidas!" })
        return;
    }

    response.status(404);
    response.json({ err: "E-mail enviado não foi encontradao na base de dados!" });
})


app.listen(45678, () => {
    console.log('API Rodando!')
});