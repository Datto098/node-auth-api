const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    resetPasswordToken: {
        type: String,
        default: undefined,
    },
    resetTokenExpires: {
        type: Date,
        default: undefined,
    },
    role: {
        type: String,
        default: "user",
    },
});

// Hash the password before saving
userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
    next();
});

// Compare the password
userSchema.methods.matchPassword = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
