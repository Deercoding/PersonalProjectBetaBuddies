import { io } from "socket.io-client";
const URL = process.env.REACT_APP_SERVER_SOCKET;
export const socket = io(URL);
