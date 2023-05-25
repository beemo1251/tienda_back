'use strict'

var express = require('express');
var productoController = require('../controllers/ProductoController');

var api = express.Router();
var auth = require('../middlewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/productos'});

//PRODUCTOS
api.post('/registro_producto_admin', [auth.auth, path], productoController.registro_producto_admin);
api.get('/listar_producto_admin', [auth.auth, path], productoController.listar_producto_admin);
api.get('/get_portada/:img', productoController.get_portada);
api.get('/obtener_producto_admin/:id', [auth.auth, path], productoController.obtener_producto_admin);
api.put('/actualizar_producto_admin/:id', [auth.auth, path], productoController.actualizar_producto_admin);
api.delete('/eliminar_producto_admin/:id', [auth.auth, path], productoController.eliminar_producto_admin);

//INVENTARIO
api.get('/listar_inventario_producto_admin/:id', auth.auth, productoController.listar_inventario_producto_admin);
api.delete('/eliminar_inventario_producto_admin/:id', auth.auth, productoController.eliminar_inventario_producto_admin);

module.exports = api;