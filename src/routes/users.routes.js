const { createUser } = require("../controller/users.controller");
const { validateUserBody } = require("../middleware/validation.middleware");

const router = require("express").Router();

// Create User Router
router.post("/createUser", validateUserBody(), createUser);

module.exports = router;
