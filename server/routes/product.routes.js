const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM products
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            products: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Gagal mengambil produk."
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT *
            FROM products
            WHERE id = $1
            `,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Produk tidak ditemukan."
            });
        }

        res.json({
            success: true,
            product: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal mengambil produk."
        });
    }
});

module.exports = router;