const mongoose = require("mongoose");

const connnectString = 'mongodb://127.0.0.1:27017/shopDEV';

mongoose.connect(connnectString)
.then(_ => console.log('mongoDB connected'))
.catch(err => console.log('mongDB error ' + err));

// mongoose.set('debug', true);
// mongoose.set('debug', {color: true});

module.exports = mongoose;