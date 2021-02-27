navigator.geolocation.getCurrentPosition(function(position) {
    let my_loc = position.coords.longitude.toFixed(3) + ";" + position.coords.latitude.toFixed(3);
    document.querySelector("#ip").innerText = my_loc;

    var ably = new Ably.Realtime(API_KEY); // make a file called api_key.js with the contents const API_KEY = "whatever";
    var channel = ably.channels.get(my_loc);

    channel.subscribe('inputdata', function(message) {
        document.querySelector("#jsondisplay").innerText = JSON.stringify(message.data);
    });
});