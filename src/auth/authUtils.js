const jwt = require("jsonwebtoken");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { asyncHandler } = require('../helpers/asyncHandler');

const KeyTokenService = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, privateKey) => {
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
    //         console.log('decode jwt::', decode);
    //     }
    // });
    return { accessToken, refreshToken };
}

const authentication = asyncHandler(async (req, res, next) => {
    /**
     * 1. check userID missing ??
     * 2. get access token
     * 3. verify access token
     * 4. check user in db
     * 5. check keyStore with userID
     */
    const userId = req.headers[HEADER.CLIENT_ID];
    if(!userId) throw new AuthFailureError('Invalid Request');

    const keyStore = await KeyTokenService.findByUserid(userId);
    if(!keyStore) throw new NotFoundError();

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if(!accessToken) throw new AuthFailureError('Invalid Request');

    try {
        const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
        if(userId != decodeUser.userid) throw new AuthFailureError('Invalid Request');
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error
    }

})

module.exports = {
    createTokenPair,
    authentication
}