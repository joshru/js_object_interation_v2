/**
 * Created by Josh Rueschenberg on 2/11/2016.
 */

function Player(game) {
    this.name = "Player";
    this.color = "#B32822";
    this.speed = 5;
    this.radius = 20;
    this.mass = this.radius;
    this.x = 400;
    this.y = 400;

    Entity.call(this, game, this.x, this.y);
}
Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.collide = function(ent) {
    return distance(this, ent) < this.radius + ent.radius;
};

Player.prototype.handleMovement = function() {
    if (Key.isDown(Key.RIGHT)) {
        this.x += this.speed;
    }
    if (Key.isDown(Key.LEFT)) {
        this.x -= this.speed;
    }
    if (Key.isDown(Key.UP)) {
        this.y -= this.speed;
    }
    if (Key.isDown(Key.DOWN)) {
        this.y += this.speed;
    }
};

Player.prototype.update = function() {
    this.handleMovement();
    for (var i = 0; i < this.game.entities.length; i++) {
        var current = this.game.entities[i];
        if (this.collide(current) && current.name === "Food") {
            this.radius += current.radius;
            this.mass  += current.mass;
            this.speed *= 0.96;
            current.removeFromWorld = true;
            this.game.foodOnScreen--;
        }
    }
};

Player.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

    ctx.fill();
    ctx.fillStyle = "Black";
    ctx.fillText("Mass: " + this.mass, this.x - this.radius/2, this.y);
    ctx.fillText("Speed: " + this.speed + "px", this.x - this.radius/2, this.y + 16);
    ctx.closePath();

    Entity.prototype.draw.call(this);
};


function Food(game) {
    this.name = "Food";
    this.color = randomColor();
    this.radius = randomInt(10);
    this.mass = this.radius;
    this.x = randomRangeInt(5, 795);
    this.y = randomRangeInt(5, 795);
    //console.log("this x = " + this.x + " | this y = " + this.y);

    Entity.call(this, game, this.x, this.y);
}
Food.prototype = new Entity();
Food.prototype.constructor = Food;

Food.prototype.update = function() {
    var food;
    for (this.game.foodOnScreen; this.game.foodOnScreen < 50; this.game.foodOnScreen++) {
        food = new Food(this.game);
        this.game.addEntity(food);
    }
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

    UP: 87, //w
    RIGHT: 68, //d
    DOWN: 83, //s
    LEFT: 65, //a
    R: 82, //R
    H: 72, //H

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

    if (event.which === 82) {
        globals.player.game.RELOAD = true;
    }
    if (event.which === Key.H) {
        globals.debug ^= true;
    }

}, false);

// main code starts here
console.log("fluxing the flux capacitor");
var canvas = document.getElementById('gameWorld');

var ctx = canvas.getContext('2d');

ctx.font = "16px serif";
var gameEngine = new GameEngine();
var pebble;

for (var i = 0; i < 50; i++) {
    pebble = new Food(gameEngine);
    gameEngine.addEntity(pebble);
    gameEngine.foodOnScreen++;
}

var player = new Player(gameEngine);
gameEngine.addEntity(player);

gameEngine.init(ctx);
gameEngine.start();