const { sendToQueue, receiveMessage } = require("../db/rabbitMQ.connection");

// Create new user
const createUser = async (req, res) => {
  try {
    await sendToQueue(
      JSON.stringify({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
      }),
      "createUser"
    );

    return res.json({ success: true, message: "User Created" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, ...e });
  }
};

module.exports = { createUser };
