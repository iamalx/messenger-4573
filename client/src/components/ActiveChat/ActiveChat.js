import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { putReadMessage } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column"
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between"
  }
}));

const ActiveChat = (props) => {
  const classes = useStyles();
  const { user } = props;
  const conversation = props.conversation || {};

  useEffect(() => {
    // mark messages as read
    // if (conversation?.messages) {
    //   const messagesToUpdate = [];
    //   for (let message of conversation.messages) {
    //     // if readByRecipient is false add to array to send to API 
    //     if ((user.id !== message.senderId) && (!message.readByRecipient))
    //       messagesToUpdate.push(message);
    //   };
    //   if (messagesToUpdate.length >= 1)
    //     props.putReadMessage({ messagesToUpdate });
    // }
    
    console.log(conversation)
    if (conversation?.messages) {
      const lastMessage =  conversation.messages[conversation.messages.length -1]
      if ((user.id !== lastMessage.senderId && conversation.unreadMssgsByRecipient > 0 ))
        props.putReadMessage(conversation.id);
    }
  }, [conversation]);

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user.id}
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) => conversation.otherUser.username === state.activeConversation
      )
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    putReadMessage: (message) => {
      dispatch(putReadMessage(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null
)
(ActiveChat);
