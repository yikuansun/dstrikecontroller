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
    },
    joystick2: {
        x: 0,
        y: 0
    },
    elementpad: {
        black: false,
        yellow: false,
        red: false,
        blue: false
    }
};

navigator.geolocation.getCurrentPosition(function(position) {
    var ably = new Ably.Realtime(API_KEY); // make a file called api_key.js with the contents const API_KEY = "whatever";
    var channel = ably.channels.get(position.coords.longitude.toFixed(2) + ";" + position.coords.latitude.toFixed(2));
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
    upbutton.addEventListener("touchstart", function(e) {
        e.preventDefault();
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
    leftbutton.addEventListener("touchstart", function(e) {
        e.preventDefault();
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
    downbutton.addEventListener("touchstart", function(e) {
        e.preventDefault();
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
    rightbutton.addEventListener("touchstart", function(e) {
        e.preventDefault();
        inputdata.dpad.right = true;
        channel.publish("inputdata", inputdata);
        this.style.opacity = "0.5";
    });
    rightbutton.addEventListener("touchend", function() {
        inputdata.dpad.right = false;
        channel.publish("inputdata", inputdata);
        this.style.opacity = "1";
    });

    var firsttouch = 0;

    var joystick1 = document.createElement("div");
    cover.appendChild(joystick1);
    joystick1.style.position = "fixed";
    joystick1.style.width = "40vh";
    joystick1.style.height = "40vh";
    joystick1.style.top = "50vh";
    joystick1.style.left = "40vh";
    joystick1.style.borderRadius = "25vh";
    var draggable1 = document.createElement("div");
    draggable1.style.position = "absolute";
    draggable1clientrect = joystick1.getBoundingClientRect();
    draggable1.style.left = (draggable1clientrect.width / 2).toString() + "px";
    draggable1.style.top = (draggable1clientrect.height / 2).toString() + "px";
    draggable1.style.transform = "translate(-50%, -50%)";
    draggable1.style.backgroundImage = "url(images/radgrad.png)";
    draggable1.style.backgroundSize = "100% 100%";
    draggable1.style.width = "30vh";
    draggable1.style.height = "30vh";
    draggable1.style.borderRadius = "15vh";
    joystick1.appendChild(draggable1);
    joystick1.style.border = "1vh solid grey";
    var joy1initial = [0, 0];
    var joy1frame = 0;
    draggable1.addEventListener("touchstart", function(e) {
        e.preventDefault();
        e = e.touches[0] || e.changedTouches[0];
        joy1initial = [e.clientX, e.clientY];
        joy1frame = 0;
        if (firsttouch == 0) firsttouch = 1;
    });
    draggable1.addEventListener("touchmove", function(e) {
        e.preventDefault();
        if (firsttouch == 1) e = e.touches[0] || e.changedTouches[0];
        else e = e.touches[1] || e.changedTouches[1];
        if (Math.sqrt(Math.pow((e.clientX - joy1initial[0]) / draggable1clientrect.width, 2) + Math.pow((e.clientY - joy1initial[1]) / draggable1clientrect.height, 2)) <= 0.35) {
            inputdata.joystick1.x = (e.clientX - joy1initial[0]) / draggable1clientrect.width;
            inputdata.joystick1.y = (e.clientY - joy1initial[1]) / draggable1clientrect.height;
            draggable1.style.left = (e.clientX - joy1initial[0] + draggable1clientrect.width / 2).toString() + "px";
            draggable1.style.top = (e.clientY - joy1initial[1] + draggable1clientrect.height / 2).toString() + "px";
        }
        else {
            var angle = Math.atan2((e.clientY - joy1initial[1]) / draggable1clientrect.height, (e.clientX - joy1initial[0]) / draggable1clientrect.width);
            inputdata.joystick1.x = 0.35 * Math.cos(angle);
            inputdata.joystick1.y = 0.35 * Math.sin(angle);
            draggable1.style.left = (draggable1clientrect.width / 2 + 0.35 * draggable1clientrect.width * Math.cos(angle)).toString() + "px";
            draggable1.style.top = (draggable1clientrect.height / 2 + 0.35 * draggable1clientrect.height * Math.sin(angle)).toString() + "px";
        }
        if (joy1frame % 10 == 0) channel.publish("inputdata", inputdata);
        joy1frame++;
    });
    draggable1.addEventListener("touchend", function() {
        draggable1.style.left = (draggable1clientrect.width / 2).toString() + "px";
        draggable1.style.top = (draggable1clientrect.height / 2).toString() + "px";
        inputdata.joystick1.x = 0;
        inputdata.joystick1.y = 0;
        channel.publish("inputdata", inputdata);
        if (firsttouch == 1) firsttouch = 0;
    });

    var joystick2 = document.createElement("div");
    cover.appendChild(joystick2);
    joystick2.style.position = "fixed";
    joystick2.style.width = "40vh";
    joystick2.style.height = "40vh";
    joystick2.style.top = "50vh";
    joystick2.style.right = "40vh";
    joystick2.style.borderRadius = "25vh";
    var draggable2 = document.createElement("div");
    draggable2.style.position = "absolute";
    draggable2clientrect = joystick2.getBoundingClientRect();
    draggable2.style.left = (draggable2clientrect.width / 2).toString() + "px";
    draggable2.style.top = (draggable2clientrect.height / 2).toString() + "px";
    draggable2.style.transform = "translate(-50%, -50%)";
    draggable2.style.backgroundImage = "url(images/radgrad.png)";
    draggable2.style.backgroundSize = "100% 100%";
    draggable2.style.width = "30vh";
    draggable2.style.height = "30vh";
    draggable2.style.borderRadius = "15vh";
    joystick2.appendChild(draggable2);
    joystick2.style.border = "1vh solid grey";
    var joy2initial = [0, 0];
    var joy2frame = 0;
    draggable2.addEventListener("touchstart", function(e) {
        e.preventDefault();
        e = e.touches[0] || e.changedTouches[0];
        joy2initial = [e.clientX, e.clientY];
        joy2frame = 0;
        if (firsttouch == 0) firsttouch = 2;
    });
    draggable2.addEventListener("touchmove", function(e) {
        e.preventDefault();
        if (firsttouch == 2) e = e.touches[0] || e.changedTouches[0];
        else e = e.touches[1] || e.changedTouches[1];
        if (Math.sqrt(Math.pow((e.clientX - joy2initial[0]) / draggable2clientrect.width, 2) + Math.pow((e.clientY - joy2initial[1]) / draggable2clientrect.height, 2)) <= 0.35) {
            inputdata.joystick2.x = (e.clientX - joy2initial[0]) / draggable2clientrect.width;
            inputdata.joystick2.y = (e.clientY - joy2initial[1]) / draggable2clientrect.height;
            draggable2.style.left = (e.clientX - joy2initial[0] + draggable2clientrect.width / 2).toString() + "px";
            draggable2.style.top = (e.clientY - joy2initial[1] + draggable2clientrect.height / 2).toString() + "px";
        }
        else {
            var angle = Math.atan2((e.clientY - joy2initial[1]) / draggable2clientrect.height, (e.clientX - joy2initial[0]) / draggable2clientrect.width);
            inputdata.joystick2.x = 0.35 * Math.cos(angle);
            inputdata.joystick2.y = 0.35 * Math.sin(angle);
            draggable2.style.left = (draggable2clientrect.width / 2 + 0.35 * draggable2clientrect.width * Math.cos(angle)).toString() + "px";
            draggable2.style.top = (draggable2clientrect.height / 2 + 0.35 * draggable2clientrect.height * Math.sin(angle)).toString() + "px";
        }
        if (joy2frame % 10 == 0) channel.publish("inputdata", inputdata);
        joy2frame++;
    });
    draggable2.addEventListener("touchend", function() {
        draggable2.style.left = (draggable2clientrect.width / 2).toString() + "px";
        draggable2.style.top = (draggable2clientrect.height / 2).toString() + "px";
        inputdata.joystick2.x = 0;
        inputdata.joystick2.y = 0;
        channel.publish("inputdata", inputdata);
        if (firsttouch == 2) firsttouch = 0;
    });
    
    var elementpad = new daize.displayCanvas(50, 50, "vh");
    cover.appendChild(elementpad);
    elementpad.style.backgroundColor = "";
    elementpad.style.position = "fixed";
    elementpad.style.top = "6.9vh";
    elementpad.style.right = "6.9vh";
    var blackbutton = new daize.sprite(15, 15, 25, 10, 0, "vh");
    blackbutton.costume = "images/elements/idk.png";
    elementpad.addsprite(blackbutton);
    blackbutton.addEventListener("touchstart", function(e) {
        inputdata.elementpad.black = true;
        channel.publish("inputdata", inputdata);
        this.style.opacity = "0.5";
    });
    blackbutton.addEventListener("touchend", function() {
        inputdata.elementpad.black = false;
        channel.publish("inputdata", inputdata);
        this.style.opacity = "1";
    });
    var yellowbutton = new daize.sprite(15, 15, 10, 25, 0, "vh");
    yellowbutton.costume = "images/elements/sun.png";
    elementpad.addsprite(yellowbutton);
    yellowbutton.addEventListener("touchstart", function(e) {
        e.preventDefault();
        inputdata.elementpad.yellow = true;
        channel.publish("inputdata", inputdata);
        this.style.opacity = "0.5";
    });
    yellowbutton.addEventListener("touchend", function() {
        inputdata.elementpad.yellow = false;
        channel.publish("inputdata", inputdata);
        this.style.opacity = "1";
    });
    var bluebutton = new daize.sprite(15, 15, 25, 40, 0, "vh");
    bluebutton.costume = "images/elements/water.png";
    elementpad.addsprite(bluebutton);
    bluebutton.addEventListener("touchstart", function(e) {
        e.preventDefault();
        inputdata.elementpad.blue = true;
        channel.publish("inputdata", inputdata);
        this.style.opacity = "0.5";
    });
    bluebutton.addEventListener("touchend", function() {
        inputdata.elementpad.blue = false;
        channel.publish("inputdata", inputdata);
        this.style.opacity = "1";
    });
    var redbutton = new daize.sprite(15, 15, 40, 25, 0, "vh");
    redbutton.costume = "images/elements/fire.png";
    elementpad.addsprite(redbutton);
    redbutton.addEventListener("touchstart", function(e) {
        e.preventDefault();
        inputdata.elementpad.red = true;
        channel.publish("inputdata", inputdata);
        this.style.opacity = "0.5";
    });
    redbutton.addEventListener("touchend", function() {
        inputdata.elementpad.red = false;
        channel.publish("inputdata", inputdata);
        this.style.opacity = "1";
    });
});