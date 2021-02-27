var inputdata = {
    dpad: {
        right: false,
        up: false,
        left: false,
        down: false
    },
    joystick1: {
        x: 0,
        y: 0
    }
};

document.querySelector("button").addEventListener("click", function() {
    var ably = new Ably.Realtime(API_KEY); // make a file called api_key.js with the contents const API_KEY = "whatever";
    var channel = ably.channels.get(document.querySelector("input").value);
    channel.publish("inputdata", inputdata);
    
    var cover = document.createElement("div");
    cover.style.backgroundColor = "black";
    cover.style.position = "fixed";
    cover.style.top = "0";
    cover.style.left = "0";
    cover.style.width = "100vw";
    cover.style.height = "100vh";
    document.body.appendChild(cover);
    
    var dpad = new daize.displayCanvas(50, 50, "vh");
    cover.appendChild(dpad);
    dpad.style.backgroundColor = "";
    dpad.style.position = "fixed";
    dpad.style.top = "6.9vh";
    dpad.style.left = "6.9vh";
    var upbutton = new daize.sprite(12.5, 25, 25, 12.5, 0, "vh");
    upbutton.costume = "images/dpad/up.png";
    dpad.addsprite(upbutton);
    upbutton.addEventListener("touchstart", function() {
        inputdata.dpad.up = true;
        channel.publish("inputdata", inputdata);
        this.style.opacity = "0.5";
    });
    upbutton.addEventListener("touchend", function() {
        inputdata.dpad.up = false;
        channel.publish("inputdata", inputdata);
        this.style.opacity = "1";
    });
    var leftbutton = new daize.sprite(12.5, 25, 12.5, 25, 3 * Math.PI / 2, "vh");
    leftbutton.costume = "images/dpad/up.png";
    dpad.addsprite(leftbutton);
    leftbutton.addEventListener("touchstart", function() {
        inputdata.dpad.left = true;
        channel.publish("inputdata", inputdata);
        this.style.opacity = "0.5";
    });
    leftbutton.addEventListener("touchend", function() {
        inputdata.dpad.left = false;
        channel.publish("inputdata", inputdata);
        this.style.opacity = "1";
    });
    var downbutton = new daize.sprite(12.5, 25, 25, 37.5, Math.PI, "vh");
    downbutton.costume = "images/dpad/up.png";
    dpad.addsprite(downbutton);
    downbutton.addEventListener("touchstart", function() {
        inputdata.dpad.down = true;
        channel.publish("inputdata", inputdata);
        this.style.opacity = "0.5";
    });
    downbutton.addEventListener("touchend", function() {
        inputdata.dpad.down = false;
        channel.publish("inputdata", inputdata);
        this.style.opacity = "1";
    });
    var rightbutton = new daize.sprite(12.5, 25, 37.5, 25, Math.PI / 2, "vh");
    rightbutton.costume = "images/dpad/up.png";
    dpad.addsprite(rightbutton);
    rightbutton.addEventListener("touchstart", function() {
        inputdata.dpad.right = true;
        channel.publish("inputdata", inputdata);
        this.style.opacity = "0.5";
    });
    rightbutton.addEventListener("touchend", function() {
        inputdata.dpad.right = false;
        channel.publish("inputdata", inputdata);
        this.style.opacity = "1";
    });

    var joystick1 = document.createElement("div");
    cover.appendChild(joystick1);
    joystick1.style.position = "fixed";
    joystick1.style.width = "40vh";
    joystick1.style.height = "40vh";
    joystick1.style.top = "45vh";
    joystick1.style.left = "45vh";
    joystick1.style.borderRadius = "25vh";
    var draggable1 = document.createElement("div");
    draggable1.style.position = "absolute";
    draggable1clientrect = joystick1.getBoundingClientRect();
    draggable1.style.left = (draggable1clientrect.width / 2).toString() + "px";
    draggable1.style.top = (draggable1clientrect.height / 2).toString() + "px";
    draggable1.style.transform = "translate(-50%, -50%)";
    draggable1.style.backgroundColor = "grey";
    draggable1.style.width = "30vh";
    draggable1.style.height = "30vh";
    draggable1.style.borderRadius = "15vh";
    joystick1.appendChild(draggable1);
    joystick1.style.border = "1vh solid grey";
    var joy1initial = [0, 0];
    var joy1frame = 0;
    draggable1.addEventListener("touchstart", function(e) {
        e = e.touches[0] || e.changedTouches[0];
        joy1initial = [e.clientX, e.clientY];
        joy1frame = 0;
    });
    draggable1.addEventListener("touchmove", function(e) {
        e = e.touches[0] || e.changedTouches[0];
        inputdata.joystick1.x = (e.clientX - joy1initial[0]) / draggable1clientrect.width;
        inputdata.joystick1.y = (e.clientY - joy1initial[1]) / draggable1clientrect.height;
        draggable1.style.left = (e.clientX - joy1initial[0] + draggable1clientrect.width / 2).toString() + "px";
        draggable1.style.top = (e.clientY - joy1initial[1] + draggable1clientrect.height / 2).toString() + "px";
        if (joy1frame % 10 == 0) channel.publish("inputdata", inputdata);
        joy1frame++;
    });
    draggable1.addEventListener("touchend", function() {
        draggable1.style.left = (draggable1clientrect.width / 2).toString() + "px";
        draggable1.style.top = (draggable1clientrect.height / 2).toString() + "px";
        inputdata.joystick1.x = 0;
        inputdata.joystick1.y = 0;
        channel.publish("inputdata", inputdata);
    });
});