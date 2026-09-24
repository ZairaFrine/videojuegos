const express = require("express");

const videojuegosRoutes = require("./routes/videojuegos");
const plataformasRoutes = require("./routes/plataformas");
const categoriasRoutes = require("./routes/categorias");

const app = express();

app.use(express.json());

app.use("/api/videojuegos", videojuegosRoutes);
app.use("/api/plataformas", plataformasRoutes);
app.use("/api/categorias", categoriasRoutes);

app.listen(3000, () => {
    console.log("Servidor ejecutándose en http://localhost:3000");
});