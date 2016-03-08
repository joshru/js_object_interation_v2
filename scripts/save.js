/**
 * Created by Josh on 3/4/2016.
 */

function save(stuffs) {
    var dataStream = {};
    //dataStream.stuff = game.entities;
    //dataStream['FOS'] = game.
    var string = JSON.stringify(stuffs);
    var parse = JSON.parse(string);
    console.log(string);
    console.log(parse);
    //socket.emit("save", {studentname: "Josh Rueschenberg", statename: "simState", data: JSON.stringify(stuffs)});
}