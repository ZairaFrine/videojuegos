const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.json({
        mensaje: "This is peppy, All systems Go!! "
    });
});


app.listen(3000, () => {
    console.log("Servidor ejecutándose en http://localhost:3000");
});
