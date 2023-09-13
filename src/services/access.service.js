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

getPublicKey = async(userid) => {
    const filter = {user: userid};
    const token = await keytokenModel.findOne(filter);
    return token.publicKey;
}

validateToken = async(accessToken, userID) => {
    // Lấy publicKey trong DB
    const publicKeyString = getPublicKey(userID);
    // Convert publicKey từ dạng string về dạng rsa có thể đọc được
    const publicKeyObject = crypto.createPublicKey(publicKeyString);
    // xác thực accessToken sử dụng publicKey
    jwt.verify(accessToken, publicKeyObject, (err, decode) => {
        if(err) {
            console.error('error verify token');
        } else{
            console.log('decode jwt::', decode);
        }
    });
}

const createKeyToken = async({userid, publicKey, refreshToken}) => {
        const publicKeyString = publicKey.toString();
        const filter = {user: userid};
        const update = {user: userid, publicKey: publicKeyString};
        const options = {upsert: true, new: true};
        await keytokenModel.findOneAndUpdate(filter, update, options);
}

const createAccessToken = async (payload, privateKey) => {
    const accessToken = await jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '2 days'
    });
    return accessToken;
}

const genToken = async(userInfo) => {
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
    // Lưu userid và publicKey vào bảng KeyToken
    createKeyToken({ userid: userInfo._id, publicKey })
    // tạo accessToken với privateKey
    const accessToken = await createAccessToken({ userid: userInfo._id, email: userInfo.email }, privateKey);
    return accessToken;
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