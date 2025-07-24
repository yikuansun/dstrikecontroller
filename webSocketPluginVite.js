import injectSocketIO from './socketIoHandler.js';

export const webSocketServer = {
    name: 'webSocketServer',
    configureServer(server) {
        injectSocketIO(server.httpServer);
    },
    configurePreviewServer(server) {
        injectSocketIO(server.httpServer);
    }
};