const express = require("express");
const connection = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {

    const [rows] = await connection.query(
        "SELECT VG.idVid AS 'ID', VG.nmVid AS 'Nombre', VG.descVid AS 'Descripción', VG.dateVid AS 'Lanzamiento', catP.nmPlat AS 'Plataforma'  FROM bd_videojuegos VG LEFT JOIN int_vidplat Pl ON VG.idVid = Pl.idVid LEFT JOIN cat_plataforma catP ON Pl.idPlat = catP.idPlat"
    );

    res.json(rows);
});

module.exports = router;