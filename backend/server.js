const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const pollState = require("./polls");

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://intervue-polling-system-alpha.vercel.app"
    ],
    methods: ["GET", "POST"],
  })
);

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server is running");
});


const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// teacher creates a new poll question
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

 socket.on("join-student", (name, callback) => {
  // check if name already exists
  const nameExists = Object.values(pollState.students).some(
    (student) => student.name === name
  );

  if (nameExists) {
    callback({ success: false, message: "Name already taken!" });
    return;
  }

  pollState.students[socket.id] = { name };
  callback({ success: true });
  io.emit("student-list", pollState.students);
});


  // teacher asks question
  socket.on("ask-question", (question) => {
    pollState.currentQuestion = question;
    pollState.answers = {};
    pollState.questionActive = true;
    pollState.questionStartTime = Date.now();

    io.emit("new-question", question);

    // auto-stop after 60 sec
    setTimeout(() => {
      if (pollState.questionActive) {
        pollState.questionActive = false;
        io.emit("show-results", pollState.answers);
      }
    }, pollState.questionDuration);
  });

  // student submits answer
  socket.on("submit-answer", (answer) => {
    if (!pollState.questionActive) return;
   pollState.answers[socket.id] = {
  name: pollState.students[socket.id].name,
  answer: answer
};


    // check if all answered
    const total = Object.keys(pollState.students).length;
    const answered = Object.keys(pollState.answers).length;

    if (answered === total) {
      pollState.questionActive = false;
      io.emit("show-results", pollState.answers);
    }
  });

  socket.on("disconnect", () => {
    delete pollState.students[socket.id];
    delete pollState.answers[socket.id];
    io.emit("student-list", pollState.students);
  });
});

server.listen(5000, () => console.log("Backend running on 5000"));
