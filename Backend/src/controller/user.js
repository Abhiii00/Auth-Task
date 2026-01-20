const User = require("../models/user");
const bcrypt = require("bcryptjs");

/* ------------------ GET ALL USERS ------------------ */
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false })
            .select("-password -refreshToken -__v");

        if(!users.length) {
            return res.status(404).send({
                success: false,
                message: "No users found",
            });
        }      

        return res.status(200).send({
            success: true,
            message: "Users fetched successfully",
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).send({ success: false, message: "Internal Server Error", error: err.message });
    }
};


