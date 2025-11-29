import { io } from "socket.io-client";

const socket = io("https://intervue-polling-system.onrender.com", {
  transports: ["websocket"],  
});

export default socket;
