const { body, param, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    next();
};

const registerValidation = [
    body("name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Nama harus 2-100 karakter."),

    body("email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("Email tidak valid."),

    body("password")
        .isLength({ min: 8, max: 100 })
        .withMessage("Password minimal 8 karakter.")
];

const loginValidation = [
    body("email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("Email tidak valid."),

    body("password")
        .isLength({ min: 8, max: 100 })
        .withMessage("Password tidak valid.")
];

const idValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("ID tidak valid.")
];

module.exports = {
    handleValidation,
    registerValidation,
    loginValidation,
    idValidation
};