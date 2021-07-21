const router = require("express").Router();
const { User } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");
const onlineUserSockets = require("../../onlineUserSockets");

// find users by username
router.get("/:username", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { username } = req.params;

    const users = await User.findAll({
      where: {
        username: {
          [Op.substring]: username,
        },
        id: {
          [Op.not]: req.user.id,
        },
      },
    });

    // add online status to each user that is online
    for (let i = 0; i < users.length; i++) {
      const userJSON = users[i].toJSON();
      // if (onlineUsers.includes(userJSON.id)) {
      //   userJSON.online = true;
      // }
      if (onlineUserSockets[userJSON.id]?.length > 0) {
        userJSON.online = true;
      } 
      users[i] = userJSON;
    }
    console.log(users)

    res.json(users);
  } catch (error) {
    next(error);
  }
});
 
module.exports = router;
