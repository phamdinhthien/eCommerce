const { asyncHandler } = require('../../helpers/asyncHandler');
const accessController = require('../../controllers/access.controller')
const { authentication } = require('../../auth/authUtils');

const router = require('express').Router()


// sign up
router.post('/shop/sign-up', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

router.use(authentication);
router.post('/shop/logout', asyncHandler(accessController.logout));

module.exports  = router