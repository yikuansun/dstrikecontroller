import * as skio from "sveltekit-io";
import {browser} from "$app/environment";

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

    socket.on('input', message => {

      console.log(socket.id, "Client sent:", message);

      socket.emit('message', {message: 'Hello from server !'});
    });
  });
});

export const handle = async ({ event, resolve }) => {

  if ( !browser )
    skio.get()?.emit('message', {message: `New request: ${event.request.url}`} );

  return await resolve(event);
}