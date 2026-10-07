require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const {
    securityMiddleware,
    apiLimiter
} = require("./middleware/security");

const authRoutes =
    require("./routes/auth.routes");

const productRoutes =
    require("./routes/product.routes");

const blogRoutes =
    require("./routes/blog.routes");

const orderRoutes =
    require("./routes/order.routes");

const adminRoutes =
    require("./routes/admin.routes");

const app = express();

const PORT =
    process.env.PORT || 3000;

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.disable("x-powered-by");

app.use(securityMiddleware);

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
);

app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Body Parser
|--------------------------------------------------------------------------
*/

app.use(
    express.json({
        limit: "100kb"
    })
);

app.use(
    express.urlencoded({
        extended: false,
        limit: "100kb"
    })
);

/*
|--------------------------------------------------------------------------
| Rate Limiting
|--------------------------------------------------------------------------
*/

app.use("/api", apiLimiter);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/products",
    productRoutes
);

app.use(
    "/api/blog",
    blogRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

/*
|--------------------------------------------------------------------------
| Frontend
|--------------------------------------------------------------------------
*/

app.use(
    express.static(
        path.join(
            __dirname,
            "../public"
        )
    )
);

app.get(
    "*splat",
    (req, res) => {
        res.sendFile(
            path.join(
                __dirname,
                "../public/index.html"
            )
        );
    }
);

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use(
    (error, req, res, next) => {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
);

app.listen(
    PORT,
    () => {
        console.log(
            `Server berjalan di http://localhost:${PORT}`
        );
    }
);