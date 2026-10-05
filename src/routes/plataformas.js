const express = require("express");
const connection = require("../db");

const router = express.Router();

/* * CRUD: CREATE, READ, UPDATE, DELETE  */

//Consultar todas las plataformas
router.get("/", async (req, res) => {

    const [rows] = await connection.query(
        "SELECT * FROM cat_plataforma"
    );

    res.json(rows);
});


// consulta por ID
router.get("/:id", async (req, res) => {

    const { id } = req.params;  
    // Prepared Statements
    const [rows] = await connection.execute(
        `SELECT idPlat AS 'ID', nmPlat AS 'Nombre',
            CASE
                WHEN actvPlat = 1 THEN 'Si'
                ELSE 'No'
            END AS 'Activo'
            FROM cat_plataforma
            WHERE idPlat = ?`,
        [id]
    );

    res.json(rows[0]);

});

// Agregar
router.post("/", async (req, res) => {
    const { nombre } = req.body;
    
    const [resultado] = await connection.execute(
        `INSERT INTO cat_plataforma
            (nmPlat)
            VALUES (?)`,
        [nombre]
    ); 

    res.status(201).json({
        mensaje: "Plataforma creada correctamente",
        id_plataforma: resultado.insertId
    });

});

// Actualizar
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    const [resultado] = await connection.execute(
        `UPDATE cat_plataforma
            SET nmPlat = ?
            WHERE idPlat = ?`,
        [nombre, id]
    ); 

    res.json({
        mensaje: "Plataforma actualizada correctamente",
        id_plataforma: id
    });

});

// Eliminar (desactivar)
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const [resultado] = await connection.execute(
        `UPDATE cat_plataforma
            SET actvPlat = b'0'
            WHERE idPlat = ?`,
        [id]
    );
    
    res.json({
        mensaje: "Plataforma desactivada correctamente",
        id_plataforma: id
    });

}); 

//Buscar por nombre
router.get("/buscar/:nombre", async (req, res) => {
    const { nombre } = req.params;

    const [rows] = await connection.execute(
        `SELECT idPlat AS 'ID', nmPlat AS 'Nombre',
            CASE
                WHEN actvPlat = 1 THEN 'Si'
                ELSE 'No'
            END AS 'Activo'
            FROM cat_plataforma
            WHERE nmPlat LIKE ?`,
        [`%${nombre}%`]
    );

    res.json(rows);
});

// Revivir un registro inactivo
router.put("/activar/:id", async (req, res) => {
    const { id } = req.params;

    const [resultado] = await connection.execute(
        `UPDATE cat_plataforma
            SET actvPlat = b'1'
            WHERE idPlat = ?`,
        [id]
    );

    res.json({
        mensaje: "Plataforma activada correctamente",
        id_plataforma: id
    });

}); 




module.exports = router;