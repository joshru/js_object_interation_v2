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

Grid.prototype.updateFromClone = function(game, clone) {
    this.name = clone.name;
    this.x = clone.x;
    this.y = clone.y;
    this.xWidth = clone.xWidth;
    this.yWidth = clone.yWidth;
};

Grid.prototype.update = function() {
};

Grid.prototype.draw = function() {
    GLOBALS.ctx.drawImage(this.bg, this.x, this.y, this.xWidth, this.yWidth);
    Entity.prototype.draw.call(this);
};
