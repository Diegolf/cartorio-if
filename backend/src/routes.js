const express = require('express');

const routes = express.Router();

const certificadoController = require('./controllers/certificadoController');
const authController = require('./controllers/authController');

routes.post('/registro', authController.registro);

routes.post('/certificado', certificadoController.armazenar);
routes.put('/certificado/:id',certificadoController.atualiza);
routes.get('/certificados', certificadoController.certificados);

module.exports = routes; // Exporta informações do arquivo, no caso a variável "routes"