const express = require("express");
const app = express();
const port = process.env.PORT || 3005;
const cors = require("cors");
const helmet = require("helmet");

// App Usage
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);

// Import Connections
require("./src/db/rabbitMQ.connection");

// Routes Usage
const userRoutes = require("./src/routes/users.routes");

app.use("/users", userRoutes);

// Error handler
app.use((e, req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (e instanceof ErrorHandler) {
    return res
      .status(e.statusCode)
      .send({ success: false, errors: e.serializeErrors().flat() });
  }
  if (/LIMIT/.test(e.code)) {
    return res.status(500).send({
      success: false,
      errors: [
        {
          message: e.code,
          field: e.field,
        },
      ],
    });
  }

  res.status(500).send({
    success: false,
    errors: [
      {
        message: "Something went wrong",
      },
    ],
  });
});

// 404 For Invalid Routes Handling
app.use((req, res, next) => {
  console.info(
    `404 - NotFound - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );
  res.status(404).send({
    success: false,
    errors: [
      {
        message: "NotFound: there is no handler for this url",
      },
    ],
  });
});

// Start Server function
app.listen(port, () => console.info(`listen to port ${port}`));
