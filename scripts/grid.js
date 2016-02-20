function Grid(game) {
    this.name = "Grid";
    this.x = 0;
    this.y = 0;
    this.xWidth = 1728;
    this.yWidth = 2011;
    this.bg = ASSET_MANAGER.getAsset("./img/hexGrid1.gif");

    Entity.call(this, game, this.x, this.y);
}
Grid.prototype = new Entity();
Grid.prototype.constructor = Grid;

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
