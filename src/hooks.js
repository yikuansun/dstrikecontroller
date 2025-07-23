import * as skio from "sveltekit-io";
import {browser} from "$app/environment";

let sockets = {};

skio.setup('http://localhost:3001', {
  cors: {
    origin     : "http://localhost:5173",
    credentials: true,
  },
}).then(io => {

  if ( browser )
    return;

  io.on('connect', socket => {
    console.log(socket.id, "connected");
    sockets[socket.id] = socket;

    socket.on('input', message => {
        let clientSocket = sockets[message.id];
        if ( clientSocket ) {
            clientSocket.emit(`output`, message);
        }
    });
  });
});

export const handle = async ({ event, resolve }) => {

  if ( !browser )
    skio.get()?.emit('message', {message: `New request: ${event.request.url}`} );

  return await resolve(event);
}