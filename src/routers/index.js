const { apiKey, permission } = require('../auth/checkAuth');

const router = require('express').Router()

router.use(apiKey);
router.use(permission('0000'));
router.use('/v1/api', require('./access'));

module.exports  = router