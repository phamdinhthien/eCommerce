const jwt = require("jsonwebtoken")
const { asyncHandler } = require('../helpers/asyncHandler');

const createTokenPair = asyncHandler(async (payload, publicKey, privateKey) => {
    // accessToken
    const accessToken = await jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '2 days'
    });

    const refreshToken = await jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '7 days'
    });

    // jwt.verify(accessToken, publicKey, (err, decode) => {
    //     if(err) {
    //         console.error('error verify token');
    //     } else{
    //         console.log('decode jwt::', token);
    //     }
    // });
    return { accessToken, refreshToken };
})

const authentication = asyncHandler(async (req, res, next) => {

})

module.exports = {
    createTokenPair
}