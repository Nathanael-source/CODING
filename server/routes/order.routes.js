const express = require("express");

const pool = require("../db");

const {
    authenticateToken
} = require("../middleware/auth");

const router = express.Router();

router.post(
    "/",
    authenticateToken,

    async (req, res) => {
        const client = await pool.connect();

        try {
            const { items } = req.body;

            if (
                !Array.isArray(items) ||
                items.length === 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Keranjang kosong."
                });
            }

            await client.query("BEGIN");

            let total = 0;
            const validatedItems = [];

            for (const item of items) {
                if (
                    !Number.isInteger(item.productId) ||
                    !Number.isInteger(item.quantity) ||
                    item.quantity <= 0
                ) {
                    throw new Error(
                        "Data produk tidak valid."
                    );
                }

                const productResult =
                    await client.query(
                        `
                        SELECT id, price, stock
                        FROM products
                        WHERE id = $1
                        FOR UPDATE
                        `,
                        [item.productId]
                    );

                if (
                    productResult.rows.length === 0
                ) {
                    throw new Error(
                        "Produk tidak ditemukan."
                    );
                }

                const product =
                    productResult.rows[0];

                if (
                    product.stock <
                    item.quantity
                ) {
                    throw new Error(
                        "Stok produk tidak mencukupi."
                    );
                }

                const price =
                    Number(product.price);

                total +=
                    price * item.quantity;

                validatedItems.push({
                    productId:
                        product.id,

                    quantity:
                        item.quantity,

                    price
                });
            }

            const orderResult =
                await client.query(
                    `
                    INSERT INTO orders
                    (user_id, total)
                    VALUES ($1, $2)
                    RETURNING id
                    `,
                    [
                        req.user.id,
                        total
                    ]
                );

            const orderId =
                orderResult.rows[0].id;

            for (const item of validatedItems) {
                await client.query(
                    `
                    INSERT INTO order_items
                    (order_id, product_id, quantity, price)
                    VALUES ($1, $2, $3, $4)
                    `,
                    [
                        orderId,
                        item.productId,
                        item.quantity,
                        item.price
                    ]
                );

                await client.query(
                    `
                    UPDATE products
                    SET stock = stock - $1
                    WHERE id = $2
                    `,
                    [
                        item.quantity,
                        item.productId
                    ]
                );
            }

            await client.query("COMMIT");

            res.status(201).json({
                success: true,
                message: "Pesanan berhasil dibuat.",
                orderId
            });

        } catch (error) {
            await client.query("ROLLBACK");

            console.error(error);

            res.status(400).json({
                success: false,
                message: error.message
            });

        } finally {
            client.release();
        }
    }
);

module.exports = router;