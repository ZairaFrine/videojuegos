const express = require("express");
const connection = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {

    const [rows] = await connection.query(
        "SELECT * FROM bd_videojuegos"
    );

    res.json(rows);
});

module.exports = router;