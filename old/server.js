const { App } = require("uWebSockets.js");
const { Server } = require("socket.io");

const app = new App();
const io = new Server();

io.attachApp(app);

io.on("connection", (socket) => {
  // ...
});

app.listen(3000, (token) => {
  if (!token) {
    console.warn("port already in use");
  }else
    console.log("server has started.");
});