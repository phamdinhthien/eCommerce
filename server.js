const app = require("./src/app");


const server = app.listen(process.env.PORT || 3030, () => {
    console.log('eCommerce start port: ' + process.env.PORT);
})

process.on('SIGINT', () => {
    server.close(() => console.log('Exit server'));
})