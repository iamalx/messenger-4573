import React, { useEffect, useState } from "react";
import { Box, Typography, Badge } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  notification: {
    height: 20,
    width: 20,
    backgroundColor: "#3F92FF",
    marginRight: 10,
    color: "white",
    fontSize: 10,
    letterSpacing: -0.5,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
}));

const StyledBadge = withStyles(() => ({
  badge: {
    right: 35,
    top: 17,
  },
}))(Badge);

const ChatContent = (props) => {
  const classes = useStyles();
  const [ unreadMessages, setUnreadMessages ] = useState(0);

  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;

  useEffect(() => {
    // update unreadMessages count in state
    let unreadMessagesCount = 0;
    for (let message of conversation.messages) {
      if (conversation.otherUser.id === message.senderId && !message.readByRecipient)
        // count unread messages if sent to user
        unreadMessagesCount ++;
    };

    // set timeout to remove badge after 1.5s
    if (unreadMessagesCount == 0 && unreadMessages >  unreadMessagesCount)
      setTimeout( _ => { setUnreadMessages(unreadMessagesCount) }, 1500);
    else 
      setUnreadMessages(unreadMessagesCount);

  }, [conversation]);

  return (
    <Box className={classes.root}>
        <Box>
            <Typography className={classes.username}>
              {otherUser.username}
            </Typography>
            <Typography className={classes.previewText}>
              {latestMessageText}
            </Typography>
        </Box>
        <StyledBadge badgeContent={unreadMessages} color="primary">    
        </StyledBadge>
    </Box>
  );
};

export default ChatContent;
