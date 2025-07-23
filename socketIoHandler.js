import { Server } from 'socket.io';

let sockets = {};

export default function injectSocketIO(server) {
    const io = new Server(server);

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