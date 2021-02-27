navigator.geolocation.getCurrentPosition(function(position) {
    var inputdata = inputdata = {
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
    let my_loc = position.coords.longitude.toFixed(2) + ";" + position.coords.latitude.toFixed(2);
    document.querySelector("#ip").innerText = my_loc;

    var ably = new Ably.Realtime(API_KEY); // make a file called api_key.js with the contents const API_KEY = "whatever";
    var channel = ably.channels.get(my_loc);

    channel.subscribe('inputdata', function(message) {
        inputdata = message.data;
    });

    const global_unit_type = "px";

    greenimg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAANQTFRFALAAQ7+TYgAAAApJREFUeJxjYAAAAAIAAUivpHEAAAAASUVORK5CYII=";

    mycanvas = new daize.displayCanvas(800, 500, global_unit_type);
    document.body.appendChild(mycanvas);
    mycanvas.style.backgroundImage = "linear-gradient(skyblue, deepskyblue)";

    mysprite = new daize.sprite(100, 100, 100, 100, 0, global_unit_type);
    mycanvas.addsprite(mysprite);
    mysprite.costume = "https://bit.ly/dumbguypng";

    floor = new daize.sprite(800, 100, 400, 450, 0, global_unit_type);
    mycanvas.addsprite(floor);
    floor.costume = greenimg;

    velocity_up = 0;

    function gameLoop() {
        if (inputdata.dpad.right) {
            mysprite.x += 5;
        }
        if (inputdata.dpad.left) {
            mysprite.x -= 5;
        }

        if (!mysprite.boxcollision(floor)) {
            velocity_up -= 1;
        }
        else {
            while (mysprite.boxcollision(floor)) {
                velocity_up = 0;
                mysprite.y -= 1;
            }
            mysprite.y += 1;
            if (inputdata.elementpad.blue) {
                velocity_up = 10;
            }
        }
        mysprite.movevec(velocity_up, Math.PI / 2);
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});