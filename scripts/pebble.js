function Food(game) {
    this.game = game;
    this.name = "Food";
    this.color = randomColor();
    this.radius = GLOBALS.pebbleSize/*randomInt(10)*/;
    this.mass = this.radius;
    this.x = randomRangeInt(5, GLOBALS.canvas.width - 5);
    this.y = randomRangeInt(5, GLOBALS.canvas.height - 5);
    this.fleeRadius = 150;
    //console.log("this x = " + this.x + " | this y = " + this.y);

    this.velocity = {x: Math.random() * 100, y: Math.random() * 100};

    Entity.call(this, game, this.x, this.y);
}
Food.prototype = new Entity();
Food.prototype.constructor = Food;

Food.prototype.updateFromClone = function(game, clone) {
    this.game = game;
    this.name = clone.name;
    this.color = clone.color;
    this.radius = clone.radius;
    this.mass = clone.radius;
    this.x = clone.x;
    this.y = clone.y;
    this.fleeRadius = 150;
    this.velocity = clone.velocity;
};

Food.prototype.update = function() {
    var food;

    if (!GLOBALS.simOver) {
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

                if (dist <= this.fleeRadius) {
                    var dx = this.x - current.x;
                    var dy = this.y - current.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    this.velocity.x = (dx / dist) * 100;
                    this.velocity.y = (dx / dist) * 100;
                }
            }
        }
        if (this.collideLeft() || this.collideRight()) {
            this.velocity.x = -this.velocity.x;
        } else if (this.collideTop() || this.collideBottom()) {
            this.velocity.y = -this.velocity.y;
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

Food.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Food.prototype.collideRight = function () {
    return (this.x + this.radius) > GLOBALS.canvas.width;
};

Food.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Food.prototype.collideBottom = function () {
    return (this.y + this.radius) > GLOBALS.canvas.height;
};

Food.prototype.updateXY = function (x, y) {
    this.x = x;
    this.y = y;
};