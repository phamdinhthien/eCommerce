const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

const genToken = async(shop) => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    })

    const publicKeyString = await KeyTokenService.createKeyToken({
        userid: shop._id,
        publicKey
    })
    if (!publicKeyString) {
        return {
            code: 'xxx',
            message: 'publicKeyString error'
        }
    }
    const publicKeyObject = crypto.createPublicKey(publicKeyString);
    const tokens = await createTokenPair({ userid: shop._id, email: shop.email }, publicKeyObject, privateKey);
    return tokens;
}

class AccessService {

    /**
     * login
     */
    static login = async({email, password, refreshToken = null}) => {
        const foundShop = await findByEmail(email);
        if(!foundShop) throw new BadRequestError('Shop not registered');
        const match = bcrypt.compare(password, foundShop.password);
        if(!match) throw new AuthFailureError('Authen error');
        const tokens = await genToken(foundShop);
        await KeyTokenService.createKeyToken({
            userid: foundShop._id,
            publicKey: tokens.publicKey,
            refreshToken: tokens.refreshToken
        })
        return {
            shop: getInfoData({ field: ["_id", "name", "email"], object: foundShop }),
            tokens
        }
    }

    /**
     * sign up
     * @returns 
     */
    static signUp = async ({ name, email, password }) => {
        const checkExistShop = await shopModel.findOne({ email }).lean();
        if (checkExistShop) {
            throw new BadRequestError('Error: Shop exists');
        }
        // const passwordHash = await bcrypt.hash(password, 10);
        // const newShop = await shopModel.create({
        //     name, email, password: passwordHash, roles: [RoleShop.SHOP]
        // })
        // if (newShop) {
        //     const tokens = genToken(newShop);
        //     return {
        //         shop: getInfoData({ field: ["_id", "name", "email"], object: newShop }),
        //         tokens
        //     }
        // }
        return {
            code: 200,
            newdata: null
        }
    }
}

module.exports = AccessService;