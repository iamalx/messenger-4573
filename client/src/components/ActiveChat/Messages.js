import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  const lastMessageIndex = messages.length -1;
  
  return (
    <Box>
      {messages.map((message, i) => {
        const time = moment(message.createdAt).format("h:mm");
        const showReadByRecipient = i === lastMessageIndex ? message.readByRecipient: false; 

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} otherUser={otherUser} readByRecipient={showReadByRecipient}/>
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
