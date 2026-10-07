const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const securityMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],

            scriptSrc: [
                "'self'",
                "https://cdn.tailwindcss.com"
            ],

            styleSrc: [
                "'self'",
                "'unsafe-inline'"
            ],

            imgSrc: [
                "'self'",
                "data:",
                "https:"
            ],

            connectSrc: [
                "'self'"
            ],

            fontSrc: [
                "'self'",
                "https:",
                "data:"
            ],

            objectSrc: ["'none'"],

            frameAncestors: ["'none'"],

            baseUri: ["'self'"],

            formAction: ["'self'"]
        }
    },

    referrerPolicy: {
        policy: "strict-origin-when-cross-origin"
    },

    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        message: "Terlalu banyak request. Silakan coba lagi nanti."
    }
});

module.exports = {
    securityMiddleware,
    apiLimiter
};