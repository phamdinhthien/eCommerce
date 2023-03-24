const { asyncHandler } = require('../../helpers/asyncHandler');
const accessController = require('../../controllers/access.controller')

const router = require('express').Router()

// sign up
router.post('/shop/sign-up', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

module.exports  = router