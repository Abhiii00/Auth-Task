const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ------------------ REGISTER ------------------ */
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).send({ message: "Email already exists" });

        const hashedPass = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPass,
        });

        res.status(201).send({success: true, message: "User created", user });
    } catch (err) {
        return res.status(500).send({ success: false, message: "Internal Server Error", error: err.message });
    }
};

/* ------------------ LOGIN ------------------ */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        // Validate password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).send({ success: false, message: "Invalid password" });
        }

        // Generate tokens
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        // Save refresh token to user
        user.refreshToken = refreshToken;
        await user.save();

        // Prepare user data for response (exclude password)
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
        };

        // Send response
        return res.status(200).send({
            success: true,
            message: "Login successful",
            data: {
                user: userData,
                accessToken,
                refreshToken
            }
        });

    } catch (err) {
        return res.status(500).send({ success: false, message: "Internal Server Error", error: err.message });
    }
};
/* ------------------ REFRESH TOKEN ------------------ */
exports.refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) return res.status(401).send({ message: "Token missing" });

        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).send({ message: "Invalid token" });

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const newAccessToken = jwt.sign(
            { id: user._id, },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        user.refreshToken = newRefreshToken;
        await user.save();

        return res.status(200).send({success: true, accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
        return res.status(500).send({ success: false, message: "Internal Server Error", error: err.message });
    }
};

/* ------------------ LOGOUT ------------------ */
exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).send({ success: false, message: "Refresh token is required" });
        }

        const user = await User.findOneAndUpdate(
            { refreshToken },
            { refreshToken: null },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ success: false, message: "Invalid refresh token" });
        }

        return res.status(200).send({ success: true, message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).send({ success: false, message: "Internal Server Error", error: err.message });
    }
};

/* ------------------ RESET PASSWORD ------------------ */
exports.resetPassword = async (req, res) => {
    try {
      const { email, resetToken, newPassword } = req.body;
  
      const user = await User.findOne({
        email,
        resetToken,
        resetTokenExpiry: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).send({
          success: false,
          message: "Invalid or expired reset token",
        });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiry = null;
  
      await user.save();
  
      return res.status(200).send({
        success: true,
        message: "Password reset successfully",
      });
  
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }
  };

  /* ------------------ FORGOT PASSWORD ------------------ */
exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send({ success: false, message: "User not found" });
      }
  
      const resetToken = Math.floor(100000 + Math.random() * 900000).toString(); 
  
      user.resetToken = resetToken;
      user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; 
      await user.save();
  
      return res.status(200).send({
        success: true,
        message: "Reset token generated",
        resetToken, 
      });
  
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }
  };
  