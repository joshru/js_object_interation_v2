/**
 * Created by Josh Rueschenberg on 2/11/2016.
 */


function Food(game) {
    this.name = "Food";
    this.color = randomColor();
    this.radius = 8;
    this.x = randomRangeInt(5, 795);
    this.y = randomRangeInt(5, 795);
    //console.log("this x = " + this.x + " | this y = " + this.y);

    Entity.call(this, game, this.x, this.y);
}
Food.prototype = new Entity();
Food.prototype.constructor = Food;

Food.prototype.update = function() {
};

Food.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

    Entity.prototype.draw.call(this);
};

/**
 * Generates a random hex color code
 * Swiped from: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
 * @returns color in hex
 */
function randomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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

// main code starts here
    console.log("fluxing the flux capacitor");
    var canvas = document.getElementById('gameWorld');

    var ctx = canvas.getContext('2d');

    ctx.font = "48px serif";
    var gameEngine = new GameEngine();
    var pebble;
    for (var i = 0; i < 100; i++) {
        pebble = new Food(gameEngine);
        gameEngine.addEntity(pebble);
    }

    gameEngine.init(ctx);
    gameEngine.start();