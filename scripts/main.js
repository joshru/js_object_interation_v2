/**
 * Created by Josh Rueschenberg on 2/11/2016.
 */

GLOBALS = {
    canvas:     document.getElementById('gameWorld'),
    ctx:        document.getElementById('gameWorld').getContext('2d'),
    grid:       undefined,
    fontSize:   16,
    numPebbles: 25,
    gridWidth:  25,
    pebbleSize: 10,
    animRidges: 50,
    animAngle:  0

};

function circle(cx, cy, radius, amp, angle, sineCount) {
    var x = cx + (radius + amp * Math.sin(sineCount * angle)) * Math.cos(angle);
    var y = cy + (radius + amp * Math.sin(sineCount * angle)) * Math.sin(angle);

    return {x: x, y: y};
}

/**
 * Generates a random hex color code
 * Swiped from: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
 * @returns color in hex string format
 */
function randomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Generates a random number
 * @param n max
 * @returns {number} int: random number
 */
function randomInt(n) {
    return Math.floor(Math.random() * n);
}

function randomRangeInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Global Key object
 * Processed keyboard input
 */
var Key = {
    _pressed: {},

    UP:    87, //w
    RIGHT: 68, //d
    DOWN:  83, //s
    LEFT:  65, //a
    R:     82, //R
    H:     72, //H

    isDown: function (keyCode) {
        return this._pressed[keyCode];
    },
    onKeyDown: function (event) {

        this._pressed[event.keyCode] = true;
    },
    onKeyUp: function (event) {
        this._pressed[event.keyCode] = false;
    },
    keyPressed: function () {
        return this._pressed.length === 0;

    }

};

//Assign listeners to keys
window.addEventListener('keyup', function (event) {
    Key.onKeyUp(event);
}, false);


window.addEventListener('keydown', function (event) {
    Key.onKeyDown(event);

    if (event.whFich === 82) {
        globals.player.game.RELOAD = true;
    }
    if (event.which === Key.H) {
        globals.debug ^= true;
    }

}, false);

// main code starts here
var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/hexGrid1.gif");
ASSET_MANAGER.downloadAll(function() {
    console.log("fluxing the flux capacitor");
    GLOBALS.canvas = document.getElementById('gameWorld');

    GLOBALS.ctx = GLOBALS.canvas.getContext('2d');

    GLOBALS.ctx.font = "" + GLOBALS.fontSize + "px serif";
    var gameEngine = new GameEngine();
    var pebble;
    GLOBALS.grid = new Grid(gameEngine);
    //var bg = new Grid(gameEngine);
    gameEngine.addEntity(GLOBALS.grid);

    for (var i = 0; i < GLOBALS.numPebbles; i++) {
        pebble = new Food(gameEngine);
        gameEngine.addEntity(pebble);
        gameEngine.foodOnScreen++;
    }

    var player = new Player(gameEngine);
    gameEngine.addEntity(player);

    gameEngine.init(GLOBALS.ctx);
    gameEngine.start();
});

