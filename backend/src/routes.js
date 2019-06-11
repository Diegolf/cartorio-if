const express = require('express');

const routes = express.Router();

const certificadoController = require('./controllers/certificadoController');
const usuarioController = require('./controllers/usuarioController');
const authMiddleware = require('./middlewares/auth');

routes.post('/registro', usuarioController.registro);
routes.post('/autenticar' , usuarioController.autenticar);
routes.get('/usuario', authMiddleware, usuarioController.getUsuarioById);
routes.get('/token', authMiddleware, (req,res) => res.json({error: false}));

routes.post('/certificado', authMiddleware, certificadoController.armazenar);
routes.put('/certificado/:id',certificadoController.atualiza);
routes.get('/certificado/:id',certificadoController.getCertificadoById);
routes.get('/certificados', certificadoController.certificados);

module.exports = routes; // Exporta informações do arquivo, no caso a variável "routes"