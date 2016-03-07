/**
 * Created by Josh on 3/4/2016.
 */

function save(game) {
    var dataStream = {};
    dataStream.stuff = game.entities;
    //dataStream['FOS'] = game.foodOnScreen;
    socket.emit("save", {studentname: "Josh Rueschenberg", statename: "simState", data: JSON.stringify(game)});
}