const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUserSockets = require("../../onlineUserSockets");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
 try {
    if (!req.user) {
      return res.sendStatus(401);
    }
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
      if (onlineUserSockets[sender.id]?.length > 0) {
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
