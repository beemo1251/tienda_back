'use strict'

var Cliente = require('../models/cliente');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

const registro_cliente = async function(req, res) {
    var data = req.body;
    var clientes_arr = [];

    clientes_arr = await Cliente.find({mail:data.mail});

    if (clientes_arr.length == 0) {
        
        if (data.password) {
            bcrypt.hash(data.password, null, null, async function(err, hash) {
                if (hash) {
                    data.password = hash;
                    var reg = await Cliente.create(data);
                    res.status(200).send({message: reg});
                } else {
                    res.status(200).send({message: 'Error Server', data: undefined});
                }
            })
        } else {
            res.status(200).send({message: 'No hay una contraseña', data: undefined});    
        }

    } else {
        res.status(200).send({message: 'El correo existe en la base de datos', data: undefined});
    }
}

const login_cliente = async function(req, res) {
    var data = req.body;
    var clientes_arr = [];

    clientes_arr = await Cliente.find({mail:data.mail});

    if (clientes_arr.length == 0) {
        res.status(200).send({message: 'No se encontro el correo', data: undefined});
    } else {
        let user = clientes_arr[0];
        bcrypt.compare(data.password, user.password, async function(err, check) {
            if (check) {
                res.status(200).send({
                    data: user,
                    token: jwt.createToken(user)
                });
            } else {
                res.status(200).send({message: 'La contraseña no coincide', data: undefined});
            }
        })
    }
}

const listar_clientes_filtro_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            let registros = await Cliente.find();
            res.status(200).send({data:registros});
        } else {
            res.status(500).send({message: 'NoAccess'});
        }
    } else {
        res.status(500).send({message: 'NoAccess'});
    }
}

const registro_clientes_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            var data = req.body;

            bcrypt.hash('123456789', null, null, async function(err, hash) {
                if (hash) {
                    data.password = hash;
                    
                    let reg = await Cliente.create(data);
                    res.status(200).send({data:reg});
                } else {
                    res.status(500).send({message: 'Ocurrio un error en el servidor', data: undefined});
                }
            });
        } else {
            res.status(500).send({message: 'NoAccess'});
        }
    } else {
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_clientes_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            var id = req.params['id'];

            try {
                var reg = await Cliente.findById({_id:id});
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

const actualizar_clientes_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            var id = req.params['id'];
            var data = req.body;

            var reg = await Cliente.findByIdAndUpdate({_id:id}, {
                nombres: data.nombres,
                apellidos: data.apellidos,
                mail: data.mail,
                telefono: data.telefono,
                f_nacimiento: data.f_nacimiento,
                dni: data.dni,
                genero: data.genero
            });
            res.status(200).send({data:reg});
        } else {
            res.status(500).send({message: 'NoAccess'});
        }
    } else {
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_clientes_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            var id = req.params['id'];

            let reg = await Cliente.findByIdAndRemove({_id:id});
            res.status(200).send({data:reg});
        } else {
            res.status(500).send({message: 'NoAccess'});
        }
    } else {
        res.status(500).send({message: 'NoAccess'});
    }
}

module.exports = {
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin,
    registro_clientes_admin,
    obtener_clientes_admin,
    actualizar_clientes_admin,
    eliminar_clientes_admin
}