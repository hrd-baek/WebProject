const WebSocket = require('ws');

module.exports = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('New client connected', ip);

        ws.on('message', (message) => {
            console.log(message);
        });

        ws.on('error', (error) => {
            console.error(error);
        });

        ws.on('close', () => {
            console.log('Client disconnected', ip);
            clearInterval(ws.interval);
        });

        ws.interval = setInterval(() => {
            if (ws.readyState === ws.OPEN) {
                ws.send('Send a message from the server to the client.');
            }
        }, 3000);
    });

    // Store the WebSocket server instance
    module.exports.wss = wss;
};