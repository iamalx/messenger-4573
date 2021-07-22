const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const isAuth = require("../../middleware/is-auth");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", isAuth, async (req, res, next) => {
 try {
    const senderId = req.user.id;
    const { recipientId, text, sender, conversationId } = req.body;
    
    // find conversation to make sure we are saving to the right convo
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if(conversationId && conversation.id !== conversationId) {
      return res.sendStatus(403);
    }

    if (!conversation) {
      // create a new conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    } 
    
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
      readByRecipient: false,
    });
    
    res.status(200).json({ message, sender });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
