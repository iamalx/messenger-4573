import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  updUnreadMssgsCount,
} from "./store/conversations";

const socket = (token) => {
  const socket = io(window.location.origin, {
    query: { token }
  });

  socket.on("connect", () => {

    console.log("connected to server");
    
    socket.on("add-online-user", (id) => {
      store.dispatch(addOnlineUser(id));
    });

    socket.on("remove-offline-user", (id) => {
      store.dispatch(removeOfflineUser(id));
    });

  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
    store.dispatch(updUnreadMssgsCount(data.message.conversationId, true));
  });
  
  return socket;
}

export default socket;
