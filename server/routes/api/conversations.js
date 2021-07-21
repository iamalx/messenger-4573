const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
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
      // subQuery: true
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

      const lastMessage =  convoJSON.messages.length - 1; 
      
      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[lastMessage].text;

      //  set prop for unread messages count
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
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

// updates all unread message in a convo
router.put("/read", async (req, res, next) => { 
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { conversationId , otherUserId } = req.body;
    const senderId = req.user.id;

    const conversation = await Conversation.findConversation(
      senderId,
      otherUserId
    );
    console.log(conversation.id, conversationId, otherUserId, senderId)
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
