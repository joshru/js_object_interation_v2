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

    if (this.mass < 400) {
        for (var i = 0; i < this.game.entities.length; i++) {
            var current = this.game.entities[i];
            if (this.collide(current) && current.name === "Food") {
                this.radius += current.radius * 0.5;
                this.mass += current.mass * 0.5;
                this.speed *= 0.98;
                this.lastColorEaten = current.color;

                current.removeFromWorld = true;
                this.game.foodOnScreen--;
                //GLOBALS.numPebbles *= 0.98;
                this.scale(0.96);
            }
        }
    }

    if (this.mass > 400) GLOBALS.simOver = true;


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