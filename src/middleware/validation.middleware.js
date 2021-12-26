const { body } = require("express-validator");
const { handleError } = require("../errors/handle-validation-errors");

const validateUserBody = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Name can't be empty")
      .bail()
      .isString()
      .withMessage("Name must be string")
      .optional(),
    body("email")
      .notEmpty()
      .withMessage("Email address can't be empty")
      .bail()
      .isEmail()
      .withMessage("Invalid email format"),
    body("phoneNumber")
      .notEmpty()
      .withMessage("Phone number can't be empty")
      .isMobilePhone()
      .withMessage("Invalid phone number"),
    handleError,
  ];
};

module.exports = { validateUserBody };
