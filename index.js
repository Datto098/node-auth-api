const express = require("express");
const connect = require("./src/databases/connect");
const app = express();
const port = 3000;
let bugCache = [];
const authRoutes = require("./src/routes/auth");
const jwtRoutes = require("./src/routes/jwt");
const { APP_URL } = require("./src/configs");
// Connect to MongoDB
connect(app);

// Middleware parse JSON
app.use(express.json());

// Middleware to handle bugs
app.use((err, req, res, next) => {
    if (req.originalUrl === "/bugs") {
        res.status(500).json({
            message: "Error displaying bugs",
            error: err.message,
            stack: err.stack,
            back: "http://localhost:3000",
        });
    } else {
        const newBug = {
            id: Date.now(),
            title: err.message || "Unknown error",
            description: err.stack || "No stack trace available",
            back: "http://localhost:3000",
        };
        bugCache.push(newBug);
        res.redirect("/bugs");
    }
});

// Routes
// Route for display connection bugs
app.get("/bugs", (req, res) => {
    res.json(bugCache);
});

// Route for auth
app.use("/api/auth", authRoutes);
// Route for test JWT
app.use("/api/test-jwt", jwtRoutes);
// Route for home
app.get("/", (req, res) => {
    res.json({
        message: "Express JS, MongoDB, and JWT, Auth API",
        link_auth: APP_URL + "/api/auth",
        link_bugs: APP_URL + "/bugs",
    });
});

app.listen(port, () => {
    console.log(`App is running at ${APP_URL}`);
});

module.exports = app;
