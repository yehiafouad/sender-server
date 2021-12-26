const ampq = require("amqplib/callback_api");

const sendToQueue = async (data, queueName) => {
  let result;
  ampq.connect(
    process.env.NODE_ENV === "development"
      ? "amqp://localhost"
      : process.env.RABBITMQ_URL,
    (err, connection) => {
      if (err) {
        throw err;
      }

      // Create Channel
      connection.createChannel(async (chErr, channel) => {
        if (chErr) {
          throw chErr;
        }

        // Assert Queue
        const QUEUE = queueName;
        channel.assertQueue(QUEUE, { durable: false });

        // Send Message to queue
        channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(data)));
      });
    }
  );

  process.on("beforeExit", () => {
    connection.close();
    return result;
  });
};

// Receive Message
const receiveMessage = async (queueName) => {
  ampq.connect(
    process.env.NODE_ENV === "development"
      ? "amqp://localhost"
      : process.env.RABBITMQ_URL,
    (err, connection) => {
      if (err) {
        throw err;
      }

      // Create Channel
      connection.createChannel((chErr, channel) => {
        if (chErr) {
          throw chErr;
        }

        // Assert Queue
        const QUEUE = queueName;
        channel.assertQueue(QUEUE, { durable: false });

        // Receive Message
        channel.consume(QUEUE + "-receive", (msg) => {
          console.log("MESSAGE ===> ", msg);
          return msg;
        });
      });
    }
  );
};

module.exports = { sendToQueue, receiveMessage };
