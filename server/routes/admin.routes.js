const express = require("express");

const pool = require("../db");

const {
    authenticateToken,
    requireAdmin
} = require("../middleware/auth");

const router = express.Router();

router.use(
    authenticateToken,
    requireAdmin
);

router.get("/users", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                name,
                email,
                role,
                created_at
            FROM users
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            users: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Gagal mengambil user."
        });
    }
});

router.get("/orders", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                orders.id,
                users.name,
                users.email,
                orders.total,
                orders.status,
                orders.payment_status,
                orders.created_at
            FROM orders
            JOIN users
            ON orders.user_id = users.id
            ORDER BY orders.created_at DESC
        `);

        res.json({
            success: true,
            orders: result.rows
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal mengambil pesanan."
        });
    }
});

module.exports = router;