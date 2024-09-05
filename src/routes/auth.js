const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET, RESET_PASSWORD_URL, EMAIL, APP_URL } = require("../configs");
const { generateResetToken } = require("../utils/token");
const transporter = require("../utils/nodemailer");

// Welcome
router.get("/", (req, res) => {
    res.json({
        message: "Welcome to the auth route",
        back: APP_URL,
    });
});

// Regiser
router.post("/register", async (req, res) => {
    const { username, password, email } = req.body;
    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
        return res
            .json({
                message: "User already exists",
                back: APP_URL,
            })
            .status(400);
    }

    user = await User.findOne({ email });
    if (user) {
        return res
            .json({
                message: "Email already used",
                back: APP_URL,
            })
            .status(400);
    }

    // Create new user
    const newUser = new User({
        username,
        password,
        email,
    });

    await newUser.save();

    // Create JWT token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
        expiresIn: "7d",
    });

    // Return data to user
    res.json({
        message: "User created successfully",
        token,
        user: newUser,
    }).status(201);
});

// Login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ username });
    if (user) {
        const isMatch = await user.matchPassword(password);
        if (isMatch) {
            // Create JWT token
            const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
                expiresIn: "7d",
            });
            return res.json({
                message: "User logged in successfully",
                token,
                user,
            });
        }
    }

    res.status(400).json({
        message: "Invalid credentials",
    });
});

// Forgot password
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("No user with that email found");
        }

        // Create reset token
        const resetToken = generateResetToken();
        const resetTokenExpires = Date.now() + 3600000;
        // Save reset token and expiry date to user
        user.resetPasswordToken = resetToken;
        user.resetTokenExpires = resetTokenExpires;
        await user.save();

        const resetUrl = `${RESET_PASSWORD_URL}/${resetToken}`;
        const mailOptions = {
            from: EMAIL,
            to: user.email,
            subject: "Password Reset",
            text:
                `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `${resetUrl}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log("Error sending email:", error);
            }
            console.log("Email sent:", info.response);
        });

        res.status(200).send(
            "A password reset link has been sent to email: " + user.email
        );
    } catch (error) {
        res.status(500).json({
            message: "Error sending email",
            error: error.message,
        });
    }
});

router.get("/reset-password/:token", async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res
                .status(400)
                .send("Password reset token is invalid or has expired");
        }

        user.resetPasswordToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save();
        res.status(200).send("Token is valid, please submit your new password");
    } catch (error) {
        res.status(500).send("Error verifying token");
    }
});
module.exports = router;
