/**
 * Created by Josh on 3/4/2016.
 */

function save(stuffs) {
    console.log("saving");
    socket.emit("save", {studentname: "Josh Rueschenberg", statename: "simState", data: JSON.stringify(stuffs)});
}