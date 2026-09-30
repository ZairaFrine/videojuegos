const express = require("express");
const connection = require("../db");

const router = express.Router();

/* * CRUD: CREATE, READ, UPDATE, DELETE  */

// CONSULTAR TODAS LAS CATEGORIAS
router.get("/", async (req, res) => {

    const [rows] = await connection.query(
        "SELECT * FROM cat_categoria"
    );

    res.json(rows);
});



// consulta por ID
router.get("/:id", async (req, res) => {

    const { id } = req.params;

    const [rows] = await connection.execute(
        `SELECT idCat AS 'ID', nmCat AS 'Nombre',
            CASE
                WHEN actvCat = 1 THEN 'Si'
                ELSE 'No'
            END AS 'Activo'
            FROM cat_categoria
            WHERE idCat = ? `,
        [id]
    );

    res.json(rows[0]);

});

// Agregar
router.post("/", async (req, res) => {

    const { nombre } = req.body;
    
    const [resultado] = await connection.execute(
        `INSERT INTO cat_categoria
            (nmCat)
            VALUES (?)`,
        [nombre]
    );

    res.status(201).json({
        mensaje: "Categoría creada correctamente",
        id_categoria: resultado.insertId
    });


});



// Actualizar

router.put("/:id", async (req, res) => {

    const { id } = req.params;
    const { nombre } = req.body;

    const [resultado] = await connection.execute(
        `UPDATE cat_categoria
            SET nmCat = ?
            WHERE idCat = ?`,
        [nombre, id]
    );

    res.json({
        mensaje: "Categoría modificada correctamente"
    });

});



// Borrar, inactivar, deshabilitar, inhabilitar, quitar.... etc...

router.delete("/:id", async (req, res) => {

    const { id } = req.params;

    const [resultado] = await connection.execute(
        `UPDATE cat_categoria
            SET actvCat = 0
            WHERE idCat = ?
            AND actvCat = 0`,
        [id]
    );

    res.json({
        mensaje: "Categoría eliminada correctamente"
    });

});




module.exports = router;


