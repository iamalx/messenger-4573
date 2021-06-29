import React, { useEffect, useState } from "react";
import { Box, Typography, Badge } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Chip from '@material-ui/core/Chip';

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
  const [ unreadMessages, setUnreadMessages ] = useState(0) 

  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;

  useEffect(() => {
    console.log('chatProps', props, )
    console.log('old', unreadMessages )
    let unreadMessagesCount = 0;
    for (let message of conversation.messages) {
      if (conversation.otherUser.id === message.senderId && !message.readByRecipient)
        unreadMessagesCount ++;
    }

    if (unreadMessagesCount == 0 && unreadMessages >  unreadMessagesCount) {
      setTimeout( _ => {
        setUnreadMessages(unreadMessagesCount);
      }, 2000) 
    } else {
      setUnreadMessages(unreadMessagesCount);
    }

  }, [conversation]) 

  return (
    <Box className={classes.root}>
      {/* <Badge badgeContent={unreadMessages} color="primary"> */}
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
      {/* </Badge> */}
    </Box>
  );
};

export default ChatContent;
