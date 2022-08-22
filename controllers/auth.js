const { response, request } = require('express');
const bcryptjs = require('bcryptjs')
const expressSession = require('express-session');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {      
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        const token = await generarJWT( usuario.id );
        req.flash('success_msg', 'Login exitoso')

        res.redirect('/')

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }   
};

const signIn = async (req, res = response) => {
    res.render('login')
}

const signUp = async (req, res = response) => {
    res.render('register')
}


module.exports = {
    login,
    signIn,
    signUp
}
