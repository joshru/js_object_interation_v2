/**
 * Created by Josh Rueschenberg on 2/11/2016.
 */
// This game engine was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    // console.log("Current Game Time: " + this.gameTime);
    return gameDelta;
};

function GameEngine() {
    this.entities = [];
    this.bg = null;
    this.overlay = null;
    this.player = null;
    this.foodOnScreen = 0;
    this.showOutlines = false;
    this.ctx = null;
    this.click = null;
    this.mouse = null;
    this.wheel = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
    console.log('game initialized');
};

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
};

GameEngine.prototype.save = function() {
    //save(this);
    var globals = {pebbleSize: GLOBALS.pebbleSize, simOver: GLOBALS.simOver};
    var clone = {};
    var pebbles = [];
    var temp;
    for (var i = 0; i < this.entities.length; i++) {
        temp = {};
        var current   = this.entities[i];
        temp.name     = current.name;
        temp.color    = current.color;
        temp.radius   = current.radius;
        temp.x        = current.x;
        temp.y        = current.y;
        temp.velocity = current.velocity;
        pebbles.push(temp);
    }
    var tempPlayer = {};
    tempPlayer.name   = this.player.name;
    tempPlayer.color  = this.player.color;
    tempPlayer.LCE    = this.player.lastColorEaten;
    tempPlayer.speed  = this.player.speed;
    tempPlayer.radius = this.player.radius;
    tempPlayer.mass   = this.player.mass;
    tempPlayer.x      = this.player.x;
    tempPlayer.y      = this.player.y;

    var tempGrid = {};
    tempGrid.name   = this.bg.name;
    tempGrid.x      = this.bg.x;
    tempGrid.y      = this.bg.y;
    tempGrid.xWidth = this.bg.xWidth;
    tempGrid.yWidth = this.bg.yWidth;

    clone.globals = globals;
    clone.grid    = tempGrid;
    clone.pebbles = pebbles;
    clone.player  = tempPlayer;

    save(clone);
};

GameEngine.prototype.load = function() {
    //load();
    console.log("loading");
    socket.emit("load", {studentname: "Josh Rueschenberg", statename: "simState"});
};

GameEngine.prototype.loadResources = function(stuffs) {
    //console.log(stuffs);
    var parsed = JSON.parse(stuffs.data);
    //console.log(parsed);
    this.processLoad(parsed);
};

GameEngine.prototype.processLoad = function(data) {
    var globals = data.globals;
    var grid    = data.grid;
    var pebbles = data.pebbles;
    var player  = data.player;

    updateGlobals(globals);

    this.bg.updateFromClone(this, grid);

    for (var i = 0; i < pebbles.length; i++) {
        var clone = pebbles[i];
        this.entities[i].updateFromClone(this, clone);
    }

    this.player.updateFromClone(this, player);
};

GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (String.fromCharCode(e.which) === ' ') that.space = true;
//        console.log(e);
        e.preventDefault();
    }, false);


    this.ctx.canvas.addEventListener("click", function(e) {
        if (e.button == 0) that.leftClick = true;
        e.preventDefault();

    }, false);

    this.ctx.canvas.addEventListener("mousedown", function(e) {
        //  if (e.button == 0) that.leftClick = true;
        e.preventDefault();

    }, false);


    //stop context menu from opening when user right clicks
    this.ctx.canvas.addEventListener("contextmenu", function(e) {
        if (e.button == 0) that.rightClick = true;
        e.preventDefault();

    }, false);

    console.log('Input started');
};

GameEngine.prototype.addEntity = function (entity) {
    //console.log('added entity');
    this.entities.push(entity);
};

GameEngine.prototype.addPlayer = function(player) {
    this.player = player;
};

GameEngine.prototype.addBG = function(BG) {
    this.bg = BG;
};

GameEngine.prototype.addGG = function(GG) {
    this.overlay = GG;
};

//TODO consider making a function 'addBullet'
//This approach may end up getting redundant if we end up with more arrays of different entity types

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.save();
    //Draw entities
    this.drawEntitiesIn(this.entities);
    this.ctx.restore();
};

/**
 * Calls draw on all elements of a given array
 * @param array of entities
 */
GameEngine.prototype.drawEntitiesIn = function(array) {
    this.bg.draw();
    this.player.draw();
    for (var i = 0; i < array.length; i++) array[i].draw(this.ctx);
    if (GLOBALS.simOver) this.overlay.draw(this.ctx);
};
/**
 * Calls update on all elements in a given array
 * @param array of entities
 */
GameEngine.prototype.updateEntitiesIn = function(array) {
    this.bg.update();
    this.player.update();
    for (var i = 0; i < array.length; i++) {
        if (!array[i].removeFromWorld) array[i].update();
    }
};
/**
 * Removes entities that have their 'removeFromWorld' flag set
 * @param array of entities to trim
 */
GameEngine.prototype.removeFinishedFrom = function(array) {
    for (var i = array.length-1; i >= 0; i--) {
        if (array[i].removeFromWorld) array.splice(i, 1);
    }
};

/**
 * Calls every entities' update method
 */
GameEngine.prototype.update = function () {


    //Spawn zombie every 20 seconds
    /* if (Math.floor(this.timer.gameTime % 20) == 0) {
     var zombie = new Zombie(this);
     this.addEntity(zombie);
     }*/

    //update entities

    this.updateEntitiesIn(this.entities);

    //remove entities

    this.removeFinishedFrom(this.entities);

};

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
    //this.space = null;
};



function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
};

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
};

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
};

