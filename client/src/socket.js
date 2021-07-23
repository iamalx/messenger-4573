import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";

// const {token} = window.sessionStorage;
const token = localStorage.getItem("messenger-token");

console.log(token, localStorage)
// const socket = io(window.location.origin);
const socket = io(window.location.origin, {
  query: {token}
});
// socket.on('connect', function (socket) {
//   console.log("trying to connect");
  
//   socket.emit('authenticate', {token})
//   .on('authenticated', function () {
//     console.log("connected to server");  
//     socket.on("add-online-user", (id) => {
//       console.log('online', id)
//       store.dispatch(addOnlineUser(id));
//     });

//     socket.on("remove-offline-user", (id) => {
//       store.dispatch(removeOfflineUser(id));
//     });

//     socket.on("new-message", (data) => {
//       console.log('message', data)
//       store.dispatch(setNewMessage(data.message, data.sender));
//     });
    
//   })      
//   .on( "unauthorized", ( msg ) => {
//     console.log( `unauthorized: ${ JSON.stringify( msg.data ) }` );
//     // throw new Error( msg.data.type );
//   } );//send the jwt
// })

socket.on("connect", () => {

  console.log("connected to server");
  
  socket.on("add-online-user", (id) => {
    console.log('onlinen', id)

    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    console.log('ofline', id)

    store.dispatch(removeOfflineUser(id));
  });

  socket.on("new-message", (data) => {
    console.log('new-mssg', data)

    store.dispatch(setNewMessage(data.message, data.sender));
  });

});

export default socket;
