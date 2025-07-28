import { Server } from 'socket.io';

/** @type {Record<string, import('socket.io').Socket>} */
let sockets = {};

/** @param {import('http').Server} server */
export default function injectSocketIO(server) {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(socket.id, "connected");
        sockets[socket.id] = socket;

        socket.on('input', (data) => {
            let clientSocket = sockets[data.id];
            if (clientSocket) {
                clientSocket.emit(`output`, data);
            }
        });
    });

    console.log('SocketIO injected');
}