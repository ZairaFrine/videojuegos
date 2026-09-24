const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.json({
        mensaje: "Hello World!! "
    });
});


app.get("/videojuegos", (req, res) => {
    res.json([
        {
            id: 1,
            nombre: "Mairo Car 8"
        },
        {
            id: 2,
            nombre: "Estar Fax 64"
        },
        {
            id: 3,
            nombre: "The Legend of Zelda Verde"
        }
    ]);
});


app.listen(3000, () => {
    console.log("Servidor ejecutándose en http://localhost:3000");
});
