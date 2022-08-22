const { response, request } = require('express');

const mainRoute = async (req, res = response) => {
    res.render('index');
}

module.exports = {
    mainRoute,

}