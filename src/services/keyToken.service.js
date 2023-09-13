const keytokenModel = require("../models/keytoken.model");
const {Types} = require('mongoose');

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

    static findByUserid = async(userid) => {
        return await keytokenModel.findOne({user: new Types.ObjectId(userid)}).lean();
    }

    static removeKeyById = async(id) => {
        return await keytokenModel.deleteOne({"_id": id});
    }
}

module.exports = KeyTokenService;