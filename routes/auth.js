const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { login, setCookies } = require('../controllers/auth');

const router = Router();

//router.post('/user/login',[
//    check('correo', 'El correo es obligatorio').isEmail(),
//    check('password', 'La contraseña es obligatoria').not().isEmpty(),
//    validarCampos
//],login );


module.exports = router;