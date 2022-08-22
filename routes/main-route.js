const { Router } = require('express');
const { mainRoute } = require('../controllers/main-route');

const router = Router();

router.get('/', mainRoute);

module.exports = router;