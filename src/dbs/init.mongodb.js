const mongoose = require("mongoose");
const {countConnect} = require('../helpers/check.connect');
const {db: {host, port, name}} = require('../configs/config.mongodb');

const connnectString = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        mongoose.connect(connnectString)
        .then(_ => console.log('mongoDB connected pro ', countConnect(), connnectString))
        .catch(err => console.log('mongDB error ' + err));
    }
    static getInstance() {
        if(!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongDB = Database.getInstance();
module.exports = instanceMongDB;