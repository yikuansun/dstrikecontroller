Dependencies: socket.io-client
<br /> <br />

Connect to websocket
<pre>let socket = io("ws://omegapad.net");</pre>
<br /> <br />

Create controller ID and QR code
<pre>{`
let controllerId = "";
/** @type {URL} */
let controllerURL;

io.on("connect", () => {
    // use websocket ID as controller ID
    if (io.id) controllerId = io.id;
    controllerURL = new URL(\`/controller/\${controllerId}\`, https://omegapad.net);

    let qrCodeURL = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(controllerURL.toString());
    // set an img element's src attribute to the QR code URL
});

// for debugging
io.on("connect_error", err => {
    console.log(err.message);
});

// open connection
io.connect();
`.trim()}</pre>
<br /> <br />

Receive controller input
<pre>{`
io.on("output", data => {
    console.log(data);
    // {
    //     id: string,
    //     button: string,
    //     state: boolean | Object,
    // }
});
`.trim()}</pre>
<br /> <br />
