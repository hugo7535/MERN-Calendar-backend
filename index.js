const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Crear el servidor de express
const app = express();

// Base de Datos
dbConnection();

// CORS
app.use(cors());

// Directorio Público
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/eventos', require('./routes/events'));

app.use('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
});