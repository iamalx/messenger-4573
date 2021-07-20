const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");

// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Conversation.hasMany(Message);
Message.belongsTo(Conversation);

module.exports = {
  User,
  Conversation,
  Message
};
