const express = require('express');

const routes = express.Router();

const certificadoController = require('./controllers/certificadoController');

routes.post('/certificado', certificadoController.armazenar);
routes.get('/certificados', certificadoController.certificados);

module.exports = routes; // Exporta informações do arquivo, no caso a variável "routes"