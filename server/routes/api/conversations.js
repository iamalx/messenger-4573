const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");
const isAuth = require("../../middleware/is-auth");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", isAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: [["createdAt", "ASC"]]},
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });
    
    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }
    
      // set properties for notification count and latest message preview
      const unreadMssgsCount = await Message.count({
        where: {
          conversationId: convoJSON.id,
          readByRecipient: false,
          senderId: {
              [Op.not]: userId,
            },
        }
      });
      
      convoJSON.unreadMssgsByRecipient = unreadMssgsCount;
      convoJSON.latestMessageText = convoJSON.messages[0].text;
      convoJSON.messages.reverse();

      conversations[i] = convoJSON;
    }

    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
});

// updates all unread message in a convo
router.put("/read", isAuth, async (req, res, next) => { 
  try {
    const { conversationId , otherUserId } = req.body;
    const senderId = req.user.id;

    const conversation = await Conversation.findConversation(
      senderId,
      otherUserId
    );
    
    if (conversationId !== conversation.id) {
      return res.sendStatus(403);
    }
    
    await Message.update(
        {readByRecipient: true},
        {returning: true, where: { conversationId, readByRecipient: false }}
    );
  
    res.status(200).json({ conversationId });
  } catch (error) {
    next(error);
  }
})

module.exports = router;
