/**
 * Created by Josh on 3/4/2016.
 */

function load() {
    console.log("loading");
    socket.emit("load", {studentname: "Josh Rueschenberg", statename: "simState"});
}

