<script>
    import { onMount } from "svelte";
    import ioClient from "socket.io-client";
    import { page } from '$app/state';

    let io = ioClient(page.url.origin);

    /** @type {{ id: string }} */
    export let params;
    let width = 960, height = 540;

    let stickLeft = {
        angle: 0,
        distance: 0,
    };
    let stickRight = {
        angle: 0,
        distance: 0,
    };

    let dPad = {
        up: false,
        down: false,
        left: false,
        right: false,
    };
    let letterButtons = {
        alpha: false,
        beta: false,
        gamma: false,
        delta: false,
    };

    /**
     * Trigger input on websocket
     * @param {string} button
     * @param {boolean | Object} state
     */
    function sendInput(button, state) {
        io.emit(`input`, {
            id: params.id,
            button: button,
            state: state,
        });
    }

    onMount(() => {
        io.on('input', data => {
            console.log(data);
        });
    })
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">
    <rect width="100%" height="100%" fill="transparent" stroke="black" stroke-width="2" /> <!-- temporary -->
    <text x={width / 2} y="50" text-anchor="middle" alignment-baseline="middle" font-size="20" fill="grey">
        Controller ID: {params.id}
        <!-- prob temporary as well -->
    </text>
    <g>
        <circle cx="250" cy={height - 150} r="100" fill="transparent" stroke="grey" stroke-width="10"
            on:touchstart={(e) => {
                e.preventDefault();
                let touch = e.changedTouches[0];
                let cx = e.currentTarget.getBoundingClientRect().x + e.currentTarget.getBoundingClientRect().width / 2;
                let cy = e.currentTarget.getBoundingClientRect().y + e.currentTarget.getBoundingClientRect().height / 2;
                stickLeft.angle = Math.atan2(touch.clientY - cy, touch.clientX - cx);
                stickLeft.distance = Math.sqrt(Math.pow(touch.clientX - cx, 2) + Math.pow(touch.clientY - cy, 2));
                stickLeft.distance /= e.currentTarget.getBoundingClientRect().width / 2; // correct for zooming
                if (stickLeft.distance > 0.75) {
                    stickLeft.distance = 0.75;
                }
                sendInput("stickLeft", stickLeft);
            }} on:touchmove={(e) => {
                let touch = e.changedTouches[0];
                let cx = e.currentTarget.getBoundingClientRect().x + e.currentTarget.getBoundingClientRect().width / 2;
                let cy = e.currentTarget.getBoundingClientRect().y + e.currentTarget.getBoundingClientRect().height / 2;
                stickLeft.angle = Math.atan2(touch.clientY - cy, touch.clientX - cx);
                stickLeft.distance = Math.sqrt(Math.pow(touch.clientX - cx, 2) + Math.pow(touch.clientY - cy, 2));
                stickLeft.distance /= e.currentTarget.getBoundingClientRect().width / 2; // correct for zooming
                if (stickLeft.distance > 0.75) {
                    stickLeft.distance = 0.75;
                }
                sendInput("stickLeft", stickLeft);
            }} on:touchend={() => {
                stickLeft.angle = 0;
                stickLeft.distance = 0;
                sendInput("stickLeft", stickLeft);
            }} />
        <circle cx={250 + stickLeft.distance * Math.cos(stickLeft.angle) * 100} cy={height - 150 + stickLeft.distance * Math.sin(stickLeft.angle) * 100} r="80" fill="grey"
            style:pointer-events="none" />
    </g>
    <g>
        <circle cx={width - 250} cy={height - 150} r="100" fill="transparent" stroke="grey" stroke-width="10"
            on:touchstart={(e) => {
                e.preventDefault();
                let touch = e.changedTouches[0];
                let cx = e.currentTarget.getBoundingClientRect().x + e.currentTarget.getBoundingClientRect().width / 2;
                let cy = e.currentTarget.getBoundingClientRect().y + e.currentTarget.getBoundingClientRect().height / 2;
                stickRight.angle = Math.atan2(touch.clientY - cy, touch.clientX - cx);
                stickRight.distance = Math.sqrt(Math.pow(touch.clientX - cx, 2) + Math.pow(touch.clientY - cy, 2));
                stickRight.distance /= e.currentTarget.getBoundingClientRect().width / 2; // correct for zooming
                if (stickRight.distance > 0.75) {
                    stickRight.distance = 0.75;
                }
                sendInput("stickRight", stickRight);
            }} on:touchmove={(e) => {
                let touch = e.changedTouches[0];
                let cx = e.currentTarget.getBoundingClientRect().x + e.currentTarget.getBoundingClientRect().width / 2;
                let cy = e.currentTarget.getBoundingClientRect().y + e.currentTarget.getBoundingClientRect().height / 2;
                stickRight.angle = Math.atan2(touch.clientY - cy, touch.clientX - cx);
                stickRight.distance = Math.sqrt(Math.pow(touch.clientX - cx, 2) + Math.pow(touch.clientY - cy, 2));
                stickRight.distance /= e.currentTarget.getBoundingClientRect().width / 2; // correct for zooming
                if (stickRight.distance > 0.75) {
                    stickRight.distance = 0.75;
                }
                sendInput("stickRight", stickRight);
            }} on:touchend={() => {
                stickRight.angle = 0;
                stickRight.distance = 0;
                sendInput("stickRight", stickRight);
            }} />
        <circle cx={width - 250 + stickRight.distance * Math.cos(stickRight.angle) * 100} cy={height - 150 + stickRight.distance * Math.sin(stickRight.angle) * 100} r="80" fill="grey"
            style:pointer-events="none" />
    </g>
    <g>
        <circle cx="150" cy="150" r="100" fill="transparent"
            on:touchstart={(e) => {
                e.preventDefault();
                let r = e.currentTarget.getBoundingClientRect().width / 2;
                let cx = e.currentTarget.getBoundingClientRect().x + r;
                let cy = e.currentTarget.getBoundingClientRect().y + r;
                let touch = e.changedTouches[0];
                let before = Object.assign({}, dPad);
                if (touch.clientY < cy - r * 0.4) {
                    dPad.up = true;
                    dPad.down = false;
                }
                else if (touch.clientY > cy + r * 0.4) {
                    dPad.down = true;
                    dPad.up = false;
                }
                else {
                    dPad.down = false;
                    dPad.up = false;
                }
                if (touch.clientX < cx - r * 0.4) {
                    dPad.left = true;
                    dPad.right = false;
                }
                else if (touch.clientX > cx + r * 0.4) {
                    dPad.right = true;
                    dPad.left = false;
                }
                else {
                    dPad.right = false;
                    dPad.left = false;
                }
                if (dPad.up && !before.up) sendInput("dPadUp", true);
                if (dPad.down && !before.down) sendInput("dPadDown", true);
                if (dPad.left && !before.left) sendInput("dPadLeft", true);
                if (dPad.right && !before.right) sendInput("dPadRight", true);
                if (!dPad.up && before.up) sendInput("dPadUp", false);
                if (!dPad.down && before.down) sendInput("dPadDown", false);
                if (!dPad.left && before.left) sendInput("dPadLeft", false);
                if (!dPad.right && before.right) sendInput("dPadRight", false);
            }} on:touchmove={(e) => {
                e.preventDefault();
                let r = e.currentTarget.getBoundingClientRect().width / 2;
                let cx = e.currentTarget.getBoundingClientRect().x + r;
                let cy = e.currentTarget.getBoundingClientRect().y + r;
                let touch = e.changedTouches[0];
                let before = Object.assign({}, dPad);
                if (touch.clientY < cy - r * 0.4) {
                    dPad.up = true;
                    dPad.down = false;
                }
                else if (touch.clientY > cy + r * 0.4) {
                    dPad.down = true;
                    dPad.up = false;
                }
                else {
                    dPad.down = false;
                    dPad.up = false;
                }
                if (touch.clientX < cx - r * 0.4) {
                    dPad.left = true;
                    dPad.right = false;
                }
                else if (touch.clientX > cx + r * 0.4) {
                    dPad.right = true;
                    dPad.left = false;
                }
                else {
                    dPad.right = false;
                    dPad.left = false;
                }
                if (dPad.up && !before.up) sendInput("dPadUp", true);
                if (dPad.down && !before.down) sendInput("dPadDown", true);
                if (dPad.left && !before.left) sendInput("dPadLeft", true);
                if (dPad.right && !before.right) sendInput("dPadRight", true);
                if (!dPad.up && before.up) sendInput("dPadUp", false);
                if (!dPad.down && before.down) sendInput("dPadDown", false);
                if (!dPad.left && before.left) sendInput("dPadLeft", false);
                if (!dPad.right && before.right) sendInput("dPadRight", false);
            }} on:touchend={() => {
                let before = Object.assign({}, dPad);
                dPad.up = false;
                dPad.down = false;
                dPad.left = false;
                dPad.right = false;
                if (!dPad.up && before.up) sendInput("dPadUp", false);
                if (!dPad.down && before.down) sendInput("dPadDown", false);
                if (!dPad.left && before.left) sendInput("dPadLeft", false);
                if (!dPad.right && before.right) sendInput("dPadRight", false);
            }} />
        <polygon points="150,130 160,120 160,60 140,60 140,120" fill="grey" style:pointer-events="none" stroke="grey" stroke-width="17" stroke-linejoin="round"
            opacity={dPad.up ? 0.5 : 1} />
        <polygon points="130,150 120,160 60,160 60,140 120,140" fill="grey" style:pointer-events="none" stroke="grey" stroke-width="17" stroke-linejoin="round"
            opacity={dPad.left ? 0.5 : 1}/>
        <polygon points="150,170 160,180 160,240 140,240 140,180" fill="grey" style:pointer-events="none" stroke="grey" stroke-width="17" stroke-linejoin="round"
            opacity={dPad.down ? 0.5 : 1} />
        <polygon points="170,150 180,160 240,160 240,140 180,140" fill="grey" style:pointer-events="none" stroke="grey" stroke-width="17" stroke-linejoin="round"
            opacity={dPad.right ? 0.5 : 1} />
    </g>
    <g>
        <circle cx={width - 150} cy="150" r="100" fill="transparent" stroke="grey"
            on:touchstart={(e) => {
                e.preventDefault();
                let r = e.currentTarget.getBoundingClientRect().width / 2;
                let cx = e.currentTarget.getBoundingClientRect().x + r;
                let cy = e.currentTarget.getBoundingClientRect().y + r;
                let touch = e.changedTouches[0];
                let before = Object.assign({}, letterButtons);
                if (touch.clientY < cy - r * 0.4) letterButtons.alpha = true;
                else letterButtons.alpha = false;
                if (touch.clientX > cx + r * 0.4) letterButtons.beta = true;
                else letterButtons.beta = false;
                if (touch.clientX < cx - r * 0.4) letterButtons.gamma = true;
                else letterButtons.gamma = false;
                if (touch.clientY > cy + r * 0.4) letterButtons.delta = true;
                else letterButtons.delta = false;
                if (letterButtons.alpha && !before.alpha) sendInput("alphaButton", true);
                if (letterButtons.beta && !before.beta) sendInput("betaButton", true);
                if (letterButtons.gamma && !before.gamma) sendInput("gammaButton", true);
                if (letterButtons.delta && !before.delta) sendInput("deltaButton", true);
                if (!letterButtons.alpha && before.alpha) sendInput("alphaButton", false);
                if (!letterButtons.beta && before.beta) sendInput("betaButton", false);
                if (!letterButtons.gamma && before.gamma) sendInput("gammaButton", false);
                if (!letterButtons.delta && before.delta) sendInput("deltaButton", false);
            }} on:touchmove={(e) => {
                e.preventDefault();
                let r = e.currentTarget.getBoundingClientRect().width / 2;
                let cx = e.currentTarget.getBoundingClientRect().x + r;
                let cy = e.currentTarget.getBoundingClientRect().y + r;
                let touch = e.changedTouches[0];
                let before = Object.assign({}, letterButtons);
                if (touch.clientY < cy - r * 0.4) letterButtons.alpha = true;
                else letterButtons.alpha = false;
                if (touch.clientX > cx + r * 0.4) letterButtons.beta = true;
                else letterButtons.beta = false;
                if (touch.clientX < cx - r * 0.4) letterButtons.gamma = true;
                else letterButtons.gamma = false;
                if (touch.clientY > cy + r * 0.4) letterButtons.delta = true;
                else letterButtons.delta = false;
                if (letterButtons.alpha && !before.alpha) sendInput("alphaButton", true);
                if (letterButtons.beta && !before.beta) sendInput("betaButton", true);
                if (letterButtons.gamma && !before.gamma) sendInput("gammaButton", true);
                if (letterButtons.delta && !before.delta) sendInput("deltaButton", true);
                if (!letterButtons.alpha && before.alpha) sendInput("alphaButton", false);
                if (!letterButtons.beta && before.beta) sendInput("betaButton", false);
                if (!letterButtons.gamma && before.gamma) sendInput("gammaButton", false);
                if (!letterButtons.delta && before.delta) sendInput("deltaButton", false);
            }} on:touchend={() => {
                let before = Object.assign({}, letterButtons);
                letterButtons.alpha = false;
                letterButtons.beta = false;
                letterButtons.gamma = false;
                letterButtons.delta = false;
                if (!letterButtons.alpha && before.alpha) sendInput("alphaButton", false);
                if (!letterButtons.beta && before.beta) sendInput("betaButton", false);
                if (!letterButtons.gamma && before.gamma) sendInput("gammaButton", false);
                if (!letterButtons.delta && before.delta) sendInput("deltaButton", false);
            }} />
        <circle cx={width - 150} cy="90" r="25" fill="lightgreen" stroke="limegreen" stroke-width="5"
            style:pointer-events="none" opacity={letterButtons.alpha ? 0.5 : 1} />
        <text x={width - 150} y="90" text-anchor="middle" alignment-baseline="middle" font-size="32" font-weight="bold" fill="limegreen"
            opacity={letterButtons.alpha ? 0.5 : 1} style:pointer-events="none">α</text>
        <circle cx={width - 90} cy="150" r="25" fill="lightyellow" stroke="gold" stroke-width="5"
            style:pointer-events="none" opacity={letterButtons.beta ? 0.5 : 1} />
        <text x={width - 90} y="150" text-anchor="middle" alignment-baseline="middle" font-size="32" font-weight="bold" fill="gold"
            opacity={letterButtons.beta ? 0.5 : 1} style:pointer-events="none">β</text>
        <circle cx={width - 210} cy="150" r="25" fill="pink" stroke="indianred" stroke-width="5"
            style:pointer-events="none" opacity={letterButtons.gamma ? 0.5 : 1} />
        <text x={width - 210} y="150" text-anchor="middle" alignment-baseline="middle" font-size="32" font-weight="bold" fill="indianred"
            opacity={letterButtons.gamma ? 0.5 : 1} style:pointer-events="none">γ</text>
        <circle cx={width - 150} cy="210" r="25" fill="lightblue" stroke="steelblue" stroke-width="5"
            style:pointer-events="none" opacity={letterButtons.delta ? 0.5 : 1} />
        <text x={width - 150} y="210" text-anchor="middle" alignment-baseline="middle" font-size="32" font-weight="bold" fill="steelblue"
            opacity={letterButtons.delta ? 0.5 : 1} style:pointer-events="none">δ</text>
    </g>
</svg>

<style>
    svg {
        width: 100vw;
        height: 100vh;
        max-height: -webkit-fill-available;
        position: fixed;
        left: 0;
        top: 0;
    }
</style>