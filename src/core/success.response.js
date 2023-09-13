const {StatusCodes, ReasonPhrases} = require('../utils/httpStatusCode');

class SuccessResponse {
    constructor({message, statusCode = StatusCodes.OK, reasonStausCode= ReasonPhrases.OK, metadata = {}}) {
        this.message = message || reasonStausCode;
        this.status = statusCode;
        this.metadata = metadata || {};
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({message, metadata}) {
        super({message, metadata});
    }
}

class CREATED extends SuccessResponse {
    constructor({message, metadata, statusCode = StatusCodes.CREATED, reasonStausCode = ReasonPhrases.CREATED}) {
        super({message, metadata, statusCode, reasonStausCode});
    }
}

module.exports = {
    OK,
    CREATED,
    SuccessResponse
}