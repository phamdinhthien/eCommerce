const mongoose = require("mongoose");
const os = require('os');
const process = require('process');

const _SENCOND = 5000;
/**
 * Đếm số lượng kết nối mongoDB
 */
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number connect MongoDB: ${numConnection}`);
    // checkOverload();
}

/**
 * Kiểm tra quá tải kết nối mongoDB
 */
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        const maxConnectionExample = 5;
        const maxConnection = numCores * maxConnectionExample;
        console.log(`Number connect MongoDB: ${numConnection}`);
        console.log(`Memory usage: ${memoryUsage / 1024/ 1024} MB`);
        if(numConnection > maxConnection) {
            console.log('Connection overload');
        }

    }, _SENCOND);
}

module.exports = {
    countConnect
}