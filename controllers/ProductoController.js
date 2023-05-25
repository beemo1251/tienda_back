'use strici'

var Producto = require('../models/producto');
var Inventario = require('../models/inventario');
var fs = require('fs');
var path = require('path');

const registro_producto_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            let data = req.body;
            var img_path = req.files.portada.path;
            var name = img_path.split('\\');
            var portada_name = name[2];

            data.slug = data.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
            data.portada = portada_name;
            let reg = await Producto.create(data);

            let inventario = await Inventario.create({
                admin: req.user.sub,
                cantidad: data.stock,
                proveedor: '',
                producto: reg._id
            })
            res.status(200).send({data:reg, inventario: inventario});
        } else {
            res.status(500).send({message: 'NoAccess'});
        }
    } else {
        res.status(500).send({message: 'NoAccess'});
    }
}

const listar_producto_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            let reg = await Producto.find();
            res.status(200).send({data: reg});
        } else {
            res.status(500).send({message: 'NoAccess'});
        }
    } else {
        res.status(500).send({message: 'NoAccess'});
    }
}

const get_portada = async function(req, res) {
    var img = req.params['img'];

    fs.stat('./uploads/productos/' + img, function(err) {
        if (!err) {
            let path_img = './uploads/productos/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        } else {
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}

const obtener_producto_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            var id = req.params['id'];

            try {
                var reg = await Producto.findById({_id:id});
                res.status(200).send({data:reg});
            } catch (error) {
                res.status(400).send({data:undefined});
            }
        } else {
            res.status(500).send({message: 'NoAccess'});
        }
    } else {
        res.status(500).send({message: 'NoAccess'});
    }
}

const actualizar_producto_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            let id = req.params['id'];
            let data = req.body;

            if (req.files) {
                var img_path = req.files.portada.path;
                var name = img_path.split('\\');
                var portada_name = name[2];

                let reg = await Producto.findByIdAndUpdate({_id: id}, {
                    titulo: data.titulo,
                    stock: data.stock,
                    precio: data.precio,
                    categoria: data.categoria,
                    descripcion: data.descripcion,
                    contenido: data.contenido,
                    portada: portada_name
                });
                res.status(200).send({data: reg});

                fs.stat('./uploads/productos/' + reg.portada, function(err) {
                    if (!err) {
                        fs.unlink('./uploads/productos/' + reg.portada, err => {
                            if(err) throw err;
                        })
                    }
                })
            } else {
                let reg = await Producto.findByIdAndUpdate({_id: id}, {
                    titulo: data.titulo,
                    stock: data.stock,
                    precio: data.precio,
                    categoria: data.categoria,
                    descripcion: data.descripcion,
                    contenido: data.contenido
                });
                res.status(200).send({data: reg});
            }

            // data.slug = data.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
            // data.portada = portada_name;
            // let reg = await Producto.create(data);
            //res.status(200).send({data:reg});
        } else {
            res.status(500).send({message: 'NoAccess'});
        }
    } else {
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_producto_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            var id = req.params['id'];

            let reg = await Producto.findByIdAndRemove({_id:id});
            res.status(200).send({data:reg});
        } else {
            res.status(500).send({message: 'NoAccess'});
        }
    } else {
        res.status(500).send({message: 'NoAccess'});
    }
}

const listar_inventario_producto_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            var id = req.params['id'];

            var reg = await Inventario.find({producto: id}).populate('admin');
            res.status(200).send({data:reg});
        } else {
            res.status(500).send({message: 'NoAccess'});
        }
    } else {
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_inventario_producto_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            //OBTENER ID DEL INVENTARIO
            var id = req.params['id'];

            //ELIMINAR INVENTARIO
            let reg = await Inventario.findByIdAndRemove({_id: id});
            let prod = await Producto.find({_id: reg.producto});
            let nuevo_stock = parseInt(prod.stock) - parseInt(reg.stock);

            let producto = await Producto.findByIdAndUpdate({_id: reg.producto}, {
                stock: nuevo_stock
            });

            res.status(200).send({data: producto});
        }
    }
}

module.exports = {
    registro_producto_admin,
    listar_producto_admin,
    get_portada,
    obtener_producto_admin,
    actualizar_producto_admin,
    eliminar_producto_admin,
    listar_inventario_producto_admin,
    eliminar_inventario_producto_admin
}