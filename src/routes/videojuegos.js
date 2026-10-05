const express = require("express");
const connection = require("../db");

const router = express.Router();

/* * CRUD: CREATE, READ, UPDATE, DELETE  */
// * Consulta General de todos los videojuegos
router.get("/", async (req, res) => {

    try {
        const [rows] = await connection.query(
            `SELECT VG.idVid AS 'ID', VG.nmVid AS 'Nombre', VG.descVid AS 'Descripción', VG.dateVid AS 'Lanzamiento', 
            GROUP_CONCAT(
                    DISTINCT catP.nmPlat
                    ORDER BY catP.nmPlat
                    SEPARATOR ', '
                ) AS plataformas
            FROM bd_videojuegos VG
            LEFT JOIN int_vidplat Pl ON VG.idVid = Pl.idVid
            LEFT JOIN cat_plataforma catP ON Pl.idPlat = catP.idPlat
            GROUP BY VG.idVid `
        );

        res.json(rows);
    } catch (error) {
        console.error("Error al consultar los videojuegos:", error);

        res.status(500).json({
            mensaje: "Error al consultar los videojuegos",
            error: error,
            codigo: error.code,
            stack: error.stack
        });
    }


});

// * Consulta de un videojuego por ID
router.get("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await connection.execute(
        `SELECT VG.idVid AS 'ID', VG.nmVid AS 'Nombre', VG.descVid AS 'Descripción', VG.dateVid AS 'Lanzamiento',
            GROUP_CONCAT(
                    DISTINCT catP.nmPlat
                    ORDER BY catP.nmPlat
                    SEPARATOR ', '
                ) AS plataformas
            FROM bd_videojuegos VG
            LEFT JOIN int_vidplat Pl ON VG.idVid = Pl.idVid
            LEFT JOIN cat_plataforma catP ON Pl.idPlat = catP.idPlat
            WHERE VG.idVid = ?
            GROUP BY VG.idVid `,
        [id]
    );

        if (rows.length === 0) {
            return res.status(404).json({
                mensaje: "Videojuego no encontrado"
            });
        }

        res.json(rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al consultar videojuego",
            error: error,
            codigo: error.code,
            stack: error.stack
        });

    }

});


//* Agregar un nuevo videojuego
router.post("/", async (req, res) => {

    try {

        const { nombre, descripcion, lanzamiento, categorias, plataformas } = req.body;

        if (!nombre || !categorias) {

            return res.status(400).json({
                mensaje: "Nombre y categoría son obligatorios"
            });

        }


        const [resultado] = await connection.execute( 
            "INSERT INTO bd_videojuegos (nmVid, descVid, dateVid) VALUES (?, ?, ?)",
            [nombre, descripcion, lanzamiento]
        );

        const idVideojuego = resultado.insertId;

        if (Array.isArray(plataformas) && plataformas.length > 0) {

            const values = plataformas.map(plataforma => [idVideojuego, plataforma]);

            await connection.query(
                "INSERT INTO int_vidplat (idVid, idPlat) VALUES ?",
                [values]
            );
            // * INSERT INTO int_vidplat (idVid, idPlat) VALUES (10, 1),(10, 2), (10, 4);
        }

        if (Array.isArray(categorias) && categorias.length > 0) {

            const valuesCategorias = categorias.map(
                categoria => [idVideojuego, categoria]
            );

            await connection.query(
                "INSERT INTO int_vidcat (idVid, idCat) VALUES ?",
                [valuesCategorias]
            );
            // * INSERT INTO int_vidcat (idVid, idCat) VALUES (10, 1),(10, 2), (10, 4);
        }

        res.status(201).json({
            mensaje: "Videojuego creado correctamente",
            id_videojuego: idVideojuego,
            nombre: nombre,
            descripcion: descripcion,
            lanzamiento: lanzamiento
        });

    } catch (error) {

        console.error(error);  

        res.status(500).json({
            mensaje: "Error al crear videojuego",
            nombre: nombre,
            error: error,
            codigo: error.code,
            stack: error.stack
        });

    }

});


// Modificar Actualizar videojuego
router.put("/:id", async (req, res) => {

    const conn = await connection.getConnection();

    try {

        const { id } = req.params;

        const { nombre, descripcion, lanzamiento, categorias, plataformas } = req.body;

        if (!nombre || !Array.isArray(categorias)) {

            return res.status(400).json({
                mensaje: "Nombre y categorías son obligatorios"
            });

        }

        await conn.beginTransaction();

        const [resultado] = await conn.execute(
            `UPDATE bd_videojuegos
            SET nmVid = ?,
                descVid = ?,
                dateVid = ?
            WHERE idVid = ?`,
            [ nombre, descripcion, lanzamiento, id ]
        );


        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Videojuego no encontrado"
            });
        }


        //Eliminar las plataformas anteriores
        await conn.execute(
            "DELETE FROM int_vidplat WHERE idVid = ?",
            [id]
        );

        if (Array.isArray(plataformas) && plataformas.length > 0) {

            const valuesPlataformas = plataformas.map(
                plataforma => [id, plataforma]
            );

            await conn.query(
                "INSERT INTO int_vidplat (idVid, idPlat) VALUES ?",
                [valuesPlataformas]
            );

        }


        //Eliminar las categorías anteriores
        await conn.execute(
            "DELETE FROM int_vidcat WHERE idVid = ?",
            [id]
        );

        if (Array.isArray(categorias) && categorias.length > 0) {

            const valuesCategorias = categorias.map(
                categoria => [id, categoria]
            );

            await conn.query(
                "INSERT INTO int_vidcat (idVid, idCat) VALUES ?",
                [valuesCategorias]
            );

        }


        await conn.commit();

        res.json({
            mensaje: "Videojuego modificado correctamente",
            id_videojuego: id,
            nombre: nombre,
            descripcion: descripcion,
            lanzamiento: lanzamiento,
            categorias: categorias,
            plataformas: plataformas
        });


    } catch (error) {

        await conn.rollback();

        console.error(error);

        res.status(500).json({
            mensaje: "Error al modificar videojuego",
            id_videojuego: id,
            nombre: nombre,
            error: error,
            codigo: error.code,
            stack: error.stack
        });

    } finally {
        conn.release();
    }

});


//Borrado logico de un videojuego
router.delete("/:id", async (req, res) => {

    const { id } = req.params;

    try {

        const { id } = req.params;

        await conn.beginTransaction();

        const [resultado] = await conn.execute(
            `UPDATE bd_videojuegos
            SET actvVid = b'0'
            WHERE idVid = ?`,
            [ id ]
        );


        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Videojuego no encontrado"
            });
        }

        //Eliminar logicamente las plataformas anteriores
        await conn.execute(
            "UPDATE int_vidplat SET actvVidPlat = b'0' WHERE idVid = ?",
            [id]
        );

        //Eliminar logicamente las categorías anteriores
        await conn.execute(
            "UPDATE int_vidcat SET actvVidCat = b'0' WHERE idVid = ?",
            [id]
        );

        await conn.commit();

        res.json({
            mensaje: "Videojuego eliminado correctamente",
            id_videojuego: id,
            nombre: nombre
        });


    } catch (error) {

        await conn.rollback();

        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar videojuego",
            id_videojuego: id,
            nombre: nombre,
            error: error,
            codigo: error.code,
            stack: error.stack
        });

    } finally {
        conn.release();
    }

});


// Revivir un registro inactivo // Actualizar actvVid
router.put("/activar/:id", async (req, res) => {

    const { id } = req.params;

    try {

        const { id } = req.params;

        await conn.beginTransaction();

        const [resultado] = await conn.execute(
            `UPDATE bd_videojuegos
            SET actvVid = b'1'
            WHERE idVid = ?`,
            [ id ]
        );


        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Videojuego no encontrado"
            });
        }

        //Activar logicamente las plataformas anteriores
        await conn.execute(
            "UPDATE int_vidplat SET actvVidPlat = b'1' WHERE idVid = ?",
            [id]
        );

        //Activar logicamente las categorías anteriores
        await conn.execute(
            "UPDATE int_vidcat SET actvVidCat = b'1' WHERE idVid = ?",
            [id]
        );

        await conn.commit();

        res.json({
            mensaje: "Videojuego activado correctamente",
            id_videojuego: id,
            nombre: nombre
        });


    } catch (error) {

        await conn.rollback();

        console.error(error);

        res.status(500).json({
            mensaje: "Error al activar videojuego",
            id_videojuego: id,
            nombre: nombre,
            error: error,
            codigo: error.code,
            stack: error.stack
        });

    } finally {
        conn.release();
    }

});

//Buscar videojuegos por nombre
router.post("/buscarNm", async (req, res) => {

    const { nombre } = req.body; 
    nombre.trim(); // Eliminar espacios en blanco al inicio y al final
    if (!nombre) {
        return res.status(400).json({
            mensaje: "Nombre es obligatorio para buscar videojuegos"
        });
    }

    try {
        const [rows] = await connection.execute(
            `SELECT VG.idVid AS 'ID', VG.nmVid AS 'Nombre', VG.descVid AS 'Descripción', VG.dateVid AS 'Lanzamiento',
            GROUP_CONCAT(
                    DISTINCT catP.nmPlat
                    ORDER BY catP.nmPlat
                    SEPARATOR ', '
                ) AS plataformas
            FROM bd_videojuegos VG
            LEFT JOIN int_vidplat Pl ON VG.idVid = Pl.idVid
            LEFT JOIN cat_plataforma catP ON Pl.idPlat = catP.idPlat
            WHERE nmVid LIKE ? GROUP BY VG.idVid`,
            [`%${nombre}%`]
        );

        res.json(rows);
    } catch (error) {
        console.error("Error al consultar los videojuegos:", error);

        res.status(500).json({
            mensaje: "Error al consultar los videojuegos",
            error: error,
            codigo: error.code,
            stack: error.stack
        });
    }


});





module.exports = router;