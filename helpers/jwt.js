'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'luiscordova';

exports.createToken = function(user) {
    var playload = {
        sub: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        mail: user.mail,
        role: user.rol,
        iat: moment().unix(),
        exp: moment().add(7, 'days').unix()
    }

    return jwt.encode(playload, secret);
}