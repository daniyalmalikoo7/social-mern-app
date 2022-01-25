const io = require("socket.io")(8900, {
  cors: {
    //by default socket.io wont let any origin to access the socket srever, so we need to specify the origin address
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getReciever = (recieverId) => {
  return users.find((user) => user.userId === recieverId);
};

//establish a connection
io.on("connection", (socket) => {
  //when connected
  console.log("a user connected");
  //   io.to(SocketId).emit("Welcome", "Hello this is Socket Server!");

  //after every connection take userId and socketId from the user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, recieverId, text }) => {
    const user = getReciever(recieverId);
    console.log(user);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //when  disconnected
  socket.on("disconnect", () => {
    console.log(" user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
