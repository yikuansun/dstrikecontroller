<script>
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
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">
    <rect width="100%" height="100%" fill="transparent" stroke="black" stroke-width="2" /> <!-- temporary -->
    <text x={width / 2} y="50" text-anchor="middle" alignment-baseline="middle" font-size="20" fill="grey">
        Controller ID: {params.controllerId}
        <!-- prob temporary as well -->
    </text>
    <g>
        <circle cx="200" cy={height - 150} r="100" fill="transparent" stroke="grey" stroke-width="10"
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
            }} on:touchend={() => {
                stickLeft.angle = 0;
                stickLeft.distance = 0;
            }} />
        <circle cx={200 + stickLeft.distance * Math.cos(stickLeft.angle) * 100} cy={height - 150 + stickLeft.distance * Math.sin(stickLeft.angle) * 100} r="80" fill="grey"
            style:pointer-events="none" />
    </g>
    <g>
        <circle cx={width - 200} cy={height - 150} r="100" fill="transparent" stroke="grey" stroke-width="10"
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
            }} on:touchend={() => {
                stickRight.angle = 0;
                stickRight.distance = 0;
            }} />
        <circle cx={width - 200 + stickRight.distance * Math.cos(stickRight.angle) * 100} cy={height - 150 + stickRight.distance * Math.sin(stickRight.angle) * 100} r="80" fill="grey"
            style:pointer-events="none" />
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