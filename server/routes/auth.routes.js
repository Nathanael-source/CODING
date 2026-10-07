const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("../db");

const {
    handleValidation,
    registerValidation,
    loginValidation
} = require("../utils/validation");

const router = express.Router();

router.post(
    "/register",
    registerValidation,
    handleValidation,

    async (req, res) => {
        try {
            const {
                name,
                email,
                password
            } = req.body;

            const existingUser = await pool.query(
                "SELECT id FROM users WHERE email = $1",
                [email]
            );

            if (existingUser.rows.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Email sudah digunakan."
                });
            }

            const passwordHash = await bcrypt.hash(
                password,
                12
            );

            const result = await pool.query(
                `
                INSERT INTO users
                (name, email, password_hash)
                VALUES ($1, $2, $3)
                RETURNING id, name, email, role
                `,
                [
                    name,
                    email,
                    passwordHash
                ]
            );

            res.status(201).json({
                success: true,
                message: "Registrasi berhasil.",
                user: result.rows[0]
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Terjadi kesalahan server."
            });
        }
    }
);

router.post(
    "/login",
    loginValidation,
    handleValidation,

    async (req, res) => {
        try {
            const {
                email,
                password
            } = req.body;

            const result = await pool.query(
                `
                SELECT id, name, email, password_hash, role
                FROM users
                WHERE email = $1
                `,
                [email]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Email atau password salah."
                });
            }

            const user = result.rows[0];

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password_hash
                );

            if (!passwordMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Email atau password salah."
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );

            res.cookie(
                "access_token",
                token,
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 60 * 60 * 1000
                }
            );

            res.json({
                success: true,
                message: "Login berhasil.",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Terjadi kesalahan server."
            });
        }
    }
);

router.post("/logout", (req, res) => {
    res.clearCookie("access_token");

    res.json({
        success: true,
        message: "Logout berhasil."
    });
});

router.get("/me", async (req, res) => {
    const token = req.cookies?.access_token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Belum login."
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const result = await pool.query(
            `
            SELECT id, name, email, role
            FROM users
            WHERE id = $1
            `,
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "User tidak ditemukan."
            });
        }

        res.json({
            success: true,
            user: result.rows[0]
        });

    } catch {
        res.status(401).json({
            success: false,
            message: "Session tidak valid."
        });
    }
});

module.exports = router;