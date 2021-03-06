import React from "react";
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
  boldMessage: {
    fontWeight: "bold",
    color: "black"
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
  const { conversation } = props;
  const { latestMessageText, otherUser, unreadMssgsByRecipient } = conversation;

  return (
    <Box className={classes.root}>
        <Box>
            <Typography className={classes.username}>
              {otherUser.username}
            </Typography>
            <Typography className={`${unreadMssgsByRecipient && classes.boldMessage} ${classes.previewText}` }>
              {latestMessageText}
            </Typography>
        </Box>
        <StyledBadge badgeContent={unreadMssgsByRecipient} color="primary">    
        </StyledBadge>
    </Box>
  );
};

export default ChatContent;
