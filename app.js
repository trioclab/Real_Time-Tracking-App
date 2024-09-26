const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const path = require("path");

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log("Connected");

    // Handling location broadcast
    socket.on("send-location", (data) => {
        io.emit("recieve-location", { id: socket.id, ...data });
    });

    // Handling user disconnection
    socket.on("disconnect", () => {
        io.emit("user-disconnect", socket.id);
    });
});

app.get("/", (req, res) => {
    res.render("index");
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
