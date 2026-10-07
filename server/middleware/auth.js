const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const token = req.cookies?.access_token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Anda belum login."
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token tidak valid atau sudah kedaluwarsa."
        });
    }
}

function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Akses hanya untuk administrator."
        });
    }

    next();
}

module.exports = {
    authenticateToken,
    requireAdmin
};