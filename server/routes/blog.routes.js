const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                blog_posts.id,
                blog_posts.title,
                blog_posts.slug,
                blog_posts.content,
                blog_posts.category,
                blog_posts.created_at,
                users.name AS author
            FROM blog_posts
            LEFT JOIN users
            ON blog_posts.author_id = users.id
            ORDER BY blog_posts.created_at DESC
        `);

        res.json({
            success: true,
            posts: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Gagal mengambil artikel."
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const post = await pool.query(
            `
            SELECT
                blog_posts.*,
                users.name AS author
            FROM blog_posts
            LEFT JOIN users
            ON blog_posts.author_id = users.id
            WHERE blog_posts.id = $1
            `,
            [req.params.id]
        );

        if (post.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Artikel tidak ditemukan."
            });
        }

        const comments = await pool.query(
            `
            SELECT
                comments.id,
                comments.content,
                comments.created_at,
                users.name
            FROM comments
            LEFT JOIN users
            ON comments.user_id = users.id
            WHERE comments.post_id = $1
            ORDER BY comments.created_at DESC
            `,
            [req.params.id]
        );

        res.json({
            success: true,
            post: post.rows[0],
            comments: comments.rows
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal mengambil artikel."
        });
    }
});

module.exports = router;