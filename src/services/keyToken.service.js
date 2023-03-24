const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async({userid, publicKey, refreshToken}) => {
        try {
            const publicKeyString = publicKey.toString();
            // const token = await keytokenModel.create({
            //     user: userid,
            //     publicKey: publicKeyString
            // })
            // return token ? token.publicKey : null;
            const filter = {user: userid};
            const update = {user: userid, publicKey: publicKeyString, refreshTokenUsed: [], refreshToken};
            const options = {upsert: true, new: true};
            const token = await keytokenModel.findOneAndUpdate(filter, update, options);
            return token ? token.publicKey : null;
        } catch (error) {
            return error
        }
    }
}

module.exports = KeyTokenService;