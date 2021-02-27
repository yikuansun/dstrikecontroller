function text(url) {
    return fetch(url).then(res => res.text());
}
  
text('https://www.cloudflare.com/cdn-cgi/trace').then(data => {
    let ip = data.split("\n")[2].split("=")[1];
    document.querySelector("#ip").innerText = ip;

    var ably = new Ably.Realtime(API_KEY); // make a file called api_key.js with the contents const API_KEY = "whatever";
    var channel = ably.channels.get(ip);

    channel.subscribe('inputdata', function(message) {
        document.querySelector("#jsondisplay").innerText = JSON.stringify(message.data);
    });
});