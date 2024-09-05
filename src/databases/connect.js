const mongoose = require("mongoose");
const { MONGO_URI } = require("../configs");
const connect = (app) => {
    try {
        mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const db = mongoose.connection;

        db.on("error", (err) => {
            app.use((req, res, next) => {
                next(err);
            });
        });

        db.once("open", () => {
            console.log("Database connected successfully");
        });
    } catch (error) {
        app.use((req, res, next) => {
            next(error);
        });
    }
};

module.exports = connect;
