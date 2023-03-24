
const config = {
    app: {
        port: process.env.PORT
    },
    db: {
        host: process.env.MONGODB_HOST,
        port: process.env.MONGODB_PORT,
        name: process.env.MONGODB_NAME
    }
}

module.exports = config;