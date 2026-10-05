# Clase "Tecnologías Web"

Proyecto académico de ejemplo para la materia **Tecnologías para el Desarrollo de Aplicaciones Web**.

## Descripción

Este proyecto consiste en un pequeño sistema desarrollado con **Node.js**, **Express.js** y **MySQL**, cuyo propósito es enseñar los fundamentos del desarrollo de una **API REST** mediante la gestión de videojuegos, categorías y plataformas.

El proyecto permite trabajar de manera progresiva con conceptos como:

- Desarrollo del lado del servidor.
- Creación de servidores HTTP con Express.js.
- Diseño de rutas y endpoints.
- Conexión de Node.js con una base de datos.
- Ejecución de consultas SQL desde JavaScript.
- Manejo de información en formato JSON.
- Operaciones CRUD.
- Relaciones entre tablas.
- Consultas mediante `JOIN`.
- Tablas intermedias para relaciones muchos a muchos.
- Borrado lógico de registros.
- Pruebas de API mediante clientes HTTP.

---

## Objetivo

El objetivo de este proyecto es servir como material académico para que los alumnos comprendan el flujo básico de una aplicación web del lado del servidor:

```text
Cliente HTTP
    ↓
Petición HTTP
    ↓
Express.js
    ↓
Router
    ↓
Consulta SQL
    ↓
MySQL
    ↓
Resultado
    ↓
Respuesta JSON
    ↓
Cliente HTTP
```

La intención es comprender primero este proceso utilizando consultas directas a la base de datos antes de incorporar tecnologías de abstracción como un ORM.

---

## Tecnologías utilizadas

| Node.js | Entorno de ejecución de JavaScript del lado del servidor |
| Express.js | Creación del servidor y definición de rutas HTTP |
| MySQL | Sistema gestor de base de datos |
| mysql2 | Driver para conectar Node.js con MySQL |

---

## Requisitos previos

Antes de ejecutar el proyecto es necesario tener instalado:

- Node.js.
- npm.
- MySQL Server.
- Un editor de código, preferentemente Visual Studio Code.

También es necesario contar con una base de datos MySQL funcionando localmente.

---

## Base de datos

El proyecto utiliza una base de datos llamada:

```text
videojuegos
```

La base de datos debe ser creada manualmente antes de ejecutar la aplicación.

El modelo incluye, entre otras, las siguientes entidades:

```text
categoria
plataforma
videojuego
videojuego_plataforma
```

La tabla `videojuego_plataforma` permite representar la relación muchos a muchos entre videojuegos y plataformas.

Cada alumno puede modificar o ampliar el modelo dependiendo de los requerimientos de su proyecto.

---

## Estructura del proyecto

```text
videojuegos/
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
│
└── src/
    ├── app.js
    ├── db.js
    │
    └── routes/
        ├── categorias.js
        ├── plataformas.js
        └── videojuegos.js
```

### `src/app.js`

Archivo principal de la aplicación.

Se encarga de:

- Crear la aplicación Express.
- Configurar middleware.
- Registrar las rutas de la API.
- Iniciar el servidor HTTP.

### `src/db.js`

Contiene la configuración necesaria para establecer la conexión entre Node.js y MySQL mediante el paquete `mysql2`.

### `src/routes/`

Contiene las rutas correspondientes a los diferentes recursos de la API.

Actualmente se encuentran separadas en:

```text
categorias.js
plataformas.js
videojuegos.js
```

Esta separación permite mantener organizado el código y asignar responsabilidades específicas a cada módulo.

---

## Instalación

### 1. Obtener el proyecto

Descargar o clonar el repositorio y entrar en la carpeta del proyecto.

```bash
cd videojuegos
```

### 2. Instalar las dependencias

Ejecutar:

```bash
npm install
```

Este comando instalará las dependencias especificadas en:

```text
package.json
```

y generará localmente la carpeta:

```text
node_modules/
```

La carpeta `node_modules` no debe almacenarse en el repositorio Git.

---

## Configuración de MySQL

Antes de ejecutar el proyecto es necesario configurar la conexión a la base de datos.

El archivo encargado de esta configuración es:

```text
src/db.js
```

Ejemplo:

```javascript
const mysql = require("mysql2/promise");

const connection = mysql.createPool({
    host: "localhost",
    user: "TU_USUARIO",
    password: "TU_PASSWORD",
    database: "videojuegos"
});

module.exports = connection;
```

Modificar los siguientes valores de acuerdo con la instalación local de MySQL:

```text
host
user
password
database
```

El nombre esperado de la base de datos para este proyecto es:

```text
videojuegos
```

---

## Ejecución del proyecto

Actualmente el servidor se inicia directamente utilizando Node.js.

Desde la carpeta raíz del proyecto ejecutar:

```bash
node src/app.js
```

Si la aplicación inicia correctamente se mostrará un mensaje similar a:

```text
Servidor ejecutándose en http://localhost:3000
```

El servidor quedará disponible en:

```text
http://localhost:3000
```

---

## Flujo general de la aplicación

Cuando un cliente realiza una petición a la API, el flujo general es:

```text
Postman / Insomnia / Navegador
            ↓
       Petición HTTP
            ↓
          app.js
            ↓
         Router
            ↓
    Archivo de rutas
            ↓
          db.js
            ↓
          MySQL
            ↓
      Resultado SQL
            ↓
        res.json()
            ↓
       Respuesta HTTP
```

Por ejemplo:

```text
GET /api/videojuegos
```

puede provocar el siguiente flujo:

```text
GET /api/videojuegos
        ↓
Express.js
        ↓
routes/videojuegos.js
        ↓
Consulta SQL
        ↓
MySQL
        ↓
Registros
        ↓
JSON
```

---

## Organización de las rutas

La aplicación divide los recursos en diferentes archivos:

```text
/api/categorias
        ↓
routes/categorias.js


/api/plataformas
        ↓
routes/plataformas.js


/api/videojuegos
        ↓
routes/videojuegos.js
```

Esta organización permite mantener separadas las operaciones relacionadas con cada recurso.

---

## Convenciones utilizadas

La API utiliza los métodos HTTP de acuerdo con la operación que se desea realizar:

```text
GET     → Consultar información
POST    → Crear información
PUT     → Modificar información
DELETE  → Eliminar un recurso
```

En este proyecto, las operaciones de eliminación de las entidades principales se implementan mediante **borrado lógico**.

Esto significa que una petición:

```text
DELETE /api/videojuegos/5
```

no necesariamente ejecuta:

```sql
DELETE FROM videojuego;
```

En su lugar puede realizar:

```sql
UPDATE videojuego
SET activo = FALSE
WHERE id_videojuego = 5;
```

De esta manera, el registro permanece almacenado en la base de datos, pero deja de considerarse activo dentro de la aplicación.

---

## Consultas SQL

Actualmente el proyecto realiza consultas directamente sobre MySQL utilizando `mysql2`.

Ejemplo:

```javascript
const [rows] = await connection.execute(
    `
    SELECT *
    FROM categoria
    WHERE activo = TRUE
    `
);
```

Para consultas que reciben información del usuario se utilizan parámetros:

```javascript
const [rows] = await connection.execute(
    `
    SELECT *
    FROM categoria
    WHERE id_categoria = ?
    `,
    [id]
);
```

Esto permite separar los valores recibidos de la sentencia SQL.

---

## Estado actual del proyecto

Actualmente el proyecto contempla:

```text
✓ Base de datos MySQL
✓ Relaciones entre tablas
✓ Tablas intermedias
✓ Conexión Node.js → MySQL
✓ Servidor con Express.js
✓ Rutas separadas por recurso
✓ Consultas SQL directas
✓ Consultas mediante JOIN
✓ API REST
✓ Operaciones CRUD
✓ Borrado lógico
✓ Consultas por ID
✓ Consultas mediante parámetros de búsqueda
```

El proyecto continuará evolucionando durante el curso.

Posteriormente se incorporarán conceptos como:

```text
Variables de entorno
Scripts npm
Mejores prácticas de configuración
ORM
Frontend
Consumo de API
Integración cliente-servidor
```

---

## Documentación de la API

La documentación detallada de los endpoints se incorporará posteriormente.

Se documentarán de forma independiente los recursos:

```text
Categorías
Plataformas
Videojuegos
```

Para cada endpoint se especificará:

```text
Método HTTP
URL
Parámetros
Body
Ejemplo de petición
Ejemplo de respuesta
Código HTTP
Descripción
```

---

## Autoría

Proyecto académico desarrollado como material de apoyo para la materia:

**Tecnologías para el Desarrollo de Aplicaciones Web**

El proyecto puede ser utilizado y adaptado por los alumnos como referencia para el desarrollo de sus propias aplicaciones.