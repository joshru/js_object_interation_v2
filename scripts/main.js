/**
 * Created by Josh Rueschenberg on 2/11/2016.
 */

//TODO maybe for the scrolling map feature I could randomly negate x and y coordinates for spawning to get food bubbles to spawn outside the current player scope

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

function Grid(game) {
    this.name = "Grid";
    this.x = 0;
    this.y = 0;
    this.xWidth = 1728;
    this.yWidth = 2011;
    this.bg = ASSET_MANAGER.getAsset("./img/hexGrid1.gif");

    Entity.call(this, game, this.x, this.y);
}
Player.prototype = new Entity();
Player.prototype.constructor = Grid;

Grid.prototype.update = function() {
    //if (Key.isDown(Key.RIGHT)) {
    //    this.x += 5;
    //}
    //if (Key.isDown(Key.LEFT)) {
    //    this.x -= 5;
    //}
    //if (Key.isDown(Key.UP)) {
    //    this.y -= 5;
    //}
    //if (Key.isDown(Key.DOWN)) {
    //    this.y += 5;
    //}
};

Grid.prototype.draw = function() {
    //var i;
    //
    //GLOBALS.ctx.strokeStyle = "#737373";
    //for (i = 0; i < this.xWidth; i += GLOBALS.gridWidth) {
    //    GLOBALS.ctx.beginPath();
    //    GLOBALS.ctx.moveTo(i, 0);
    //    GLOBALS.ctx.lineTo(i, this.yWidth);
    //    GLOBALS.ctx.stroke();
    //    GLOBALS.ctx.closePath();
    //}
    //
    //for (i = 0; i < this.yWidth; i += GLOBALS.gridWidth) {
    //    GLOBALS.ctx.beginPath();
    //    GLOBALS.ctx.moveTo(0, i);
    //    GLOBALS.ctx.lineTo(this.xWidth, i);
    //    GLOBALS.ctx.stroke();
    //    GLOBALS.ctx.closePath();
    //}
    GLOBALS.ctx.drawImage(this.bg, this.x, this.y, this.xWidth, this.yWidth);
    Entity.prototype.draw.call(this);
};

function Player(game) {
    this.game = game;
    this.name = "Player";
    this.color = "#B32822";
    this.lastColorEaten = "";
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

// http://stackoverflow.com/questions/33586669/agar-io-style-ripple-effect-for-canvas-arcs
Player.prototype.eatAnim = function() {
    //console.log("nom");
    var amplitude = 5; //how far from the circle's circumference the sine wave will travel
    var sineCount = 30; //the number of complete sine waves to draw around the circle
    //GLOBALS.animAngle += 1;
    //if (GLOBALS.animAngle > 360) GLOBALS.animAngle = 0;


    var rotation = Math.atan2(-this.y - 90, -this.x);
    //console.log("angle = " + GLOBALS.animAngle);

    GLOBALS.ctx.save();
    GLOBALS.ctx.translate(this.x, this.y );
    GLOBALS.ctx.rotate(rotation);
    GLOBALS.ctx.translate(-(this.x), -(this.y));

    GLOBALS.ctx.beginPath();
    GLOBALS.ctx.strokeStyle = this.lastColorEaten;
    GLOBALS.ctx.fillStyle = this.lastColorEaten;
    for (var i = 0; i < 360; i++) {
        //GLOBALS.animAngle += 1;
        GLOBALS.animAngle = i * (Math.PI / 180);
        //angle += i * Math.PI / 18000;
        //angle += Math.PI / 18000;
        var point = circle(this.x, this.y, this.radius, amplitude, GLOBALS.animAngle, sineCount);
        GLOBALS.ctx.lineTo(point.x, point.y);
    }

    GLOBALS.ctx.closePath();
    GLOBALS.ctx.stroke();
    GLOBALS.ctx.fill();
    GLOBALS.ctx.restore();
    Entity.prototype.draw.call(this);
};

Player.prototype.update = function() {
    this.handleMovement();

    for (var i = 0; i < this.game.entities.length; i++) {
        var current = this.game.entities[i];
        if (this.collide(current) && current.name === "Food") {
            this.radius += current.radius * 0.5;
            this.mass   += current.mass * 0.5;
            this.speed  *= 0.98;
            this.lastColorEaten = current.color;

            current.removeFromWorld = true;
            this.game.foodOnScreen--;
            //GLOBALS.numPebbles *= 0.98;
            this.scale(0.96);
        }
    }


    Entity.prototype.update.call(this);
};

Player.prototype.draw = function() {

    this.eatAnim();
    GLOBALS.ctx.beginPath();
    GLOBALS.ctx.fillStyle = this.color;
    GLOBALS.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

    GLOBALS.ctx.fill();
    GLOBALS.ctx.fillStyle = "Black";
    GLOBALS.ctx.fillText("Mass: " + Math.round(this.mass), this.x - this.radius / 2, this.y);
    GLOBALS.ctx.fillText("Speed: " + this.speed + "px", this.x - this.radius / 2, this.y + 16);
    GLOBALS.ctx.closePath();



    Entity.prototype.draw.call(this);
};

Player.prototype.scale = function(scale) {
    if (GLOBALS.pebbleSize >= 2) {
        GLOBALS.pebbleSize *= scale;
        //var i;
        for (var i = 0; i < this.game.entities.length; i++) {
            var current = this.game.entities[i];
            if (current.name === "Food") {
                //current.radius *= scale;
                //console.log("scaling");

                current.radius = GLOBALS.pebbleSize;
                //console.log("pebble size = " + GLOBALS.pebbleSize);
                //current.draw();
            }

        }
    }
    //if (GLOBALS.gridWidth >= 7) GLOBALS.gridWidth *= scale;
    if (GLOBALS.grid.xWidth > 665 && GLOBALS.grid.yWidth > 576) {
        GLOBALS.grid.xWidth *= 0.99;
        GLOBALS.grid.yWidth *= 0.99;
    }

};
    //GLOBALS.gridWidth *= scale;

function circle(cx, cy, radius, amp, angle, sineCount) {
    var x = cx + (radius + amp * Math.sin(sineCount * angle)) * Math.cos(angle);
    var y = cy + (radius + amp * Math.sin(sineCount * angle)) * Math.sin(angle);

    return {x: x, y: y};
}


function Food(game) {
    this.game = game;
    this.name = "Food";
    this.color = randomColor();
    this.radius = GLOBALS.pebbleSize/*randomInt(10)*/;
    this.mass = this.radius;
    this.x = randomRangeInt(5, GLOBALS.canvas.width - 5);
    this.y = randomRangeInt(5, GLOBALS.canvas.height - 5);
    this.fleeRadius = 100;
    //console.log("this x = " + this.x + " | this y = " + this.y);

    this.velocity = {x: Math.random() * 100, y: Math.random() * 100};

    Entity.call(this, game, this.x, this.y);
}
Food.prototype = new Entity();
Food.prototype.constructor = Food;

Food.prototype.update = function() {
    var food;

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    for (this.game.foodOnScreen; this.game.foodOnScreen < GLOBALS.numPebbles; this.game.foodOnScreen++) {
        food = new Food(this.game);
        this.game.addEntity(food);
    }



    for (var i = 0; i < this.game.entities.length; i++) {
        var current = this.game.entities[i];
        if (current.name === "Player") {
            var dist = distance(this, current);

            if(dist <= this.fleeRadius) {
                console.log("running");
                var difX = (current.x - this.x) / dist;
                var difY = (current.y - this.y) / dist;
                this.velocity.x += difX * 1000 / (dist * dist);
                this.velocity.y += difY * 1000 / (dist * dist);
            }
        }
    }
};

Food.prototype.draw = function() {
    GLOBALS.ctx.beginPath();
    GLOBALS.ctx.fillStyle = this.color;
    //GLOBALS.ctx.clearRect(this.x, this.y, GLOBALS.pebbleSize, GLOBALS.pebbleSize);
    GLOBALS.ctx.arc(this.x, this.y, GLOBALS.pebbleSize, 0, Math.PI * 2, false);
    GLOBALS.ctx.fill();
    GLOBALS.ctx.closePath();

    Entity.prototype.draw.call(this);
};




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

