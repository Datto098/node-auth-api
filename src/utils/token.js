const crypto = require("crypto");
// Random token generator

function generateResetToken() {
    return crypto.randomBytes(20).toString("hex");
}

module.exports = {
    generateResetToken,
};
