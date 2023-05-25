'use strict'

var express = require('express');
var clienteController = require('../controllers/ClienteController');

var api = express.Router();
var auth = require('../middlewares/authenticate');

api.post('/registro_cliente', clienteController.registro_cliente);
api.post('/login_cliente', clienteController.login_cliente);

api.get('/listar_clientes_filtro_admin', auth.auth, clienteController.listar_clientes_filtro_admin);
api.post('/registro_clientes_admin', auth.auth, clienteController.registro_clientes_admin);
api.get('/obtener_clientes_admin/:id', auth.auth, clienteController.obtener_clientes_admin);
api.put('/actualizar_clientes_admin/:id', auth.auth, clienteController.actualizar_clientes_admin);
api.delete('/eliminar_clientes_admin/:id', auth.auth, clienteController.eliminar_clientes_admin);

module.exports = api;