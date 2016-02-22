function GG(game) {
    this.name = "GG";
    Entity.call(this, game, 0, 0);
}
GG.prototype = new Entity();
GG.prototype.constructor = GG;

GG.prototype.update = function(ctx) {
};

GG.prototype.draw = function(ctx) {
    if (GLOBALS.simOver) {
        ctx.fillStyle = "rgba(0, 0, 195, " + .5 + ")";
        ctx.fillRect(0, 0, GLOBALS.canvas.width, GLOBALS.canvas.height);
        ctx.fillStyle = "White";
        ctx.font = "30px Courier New";
        ctx.fillText("           Simulation over.",    10, GLOBALS.canvas.height / 2);
        ctx.fillText("                              ", 10, (GLOBALS.canvas.height / 2) + 30);
        ctx.fillText("       Please refresh the page", 10, (GLOBALS.canvas.height / 2) + 60);
        ctx.fillText("           to play again.",      10, (GLOBALS.canvas.height / 2) + 90);
    }

};


