const MONGO_URI =
    process.env.MONGO_URI || "mongodb://localhost:27017/<database_name>";
const JWT_SECRET = process.env.JWT_SECRET || "<secret_key>";
const PORT = process.env.PORT || 3000;
const RESET_PASSWORD_URL = `http://localhost:${PORT}/api/auth/reset-password`;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
const EMAIL = process.env.EMAIL || "<your_gmail>";
const PASSWORD = process.env.PASSWORD || "<your_password>";
module.exports = {
    MONGO_URI,
    JWT_SECRET,
    PORT,
    RESET_PASSWORD_URL,
    EMAIL,
    PASSWORD,
    APP_URL,
};
