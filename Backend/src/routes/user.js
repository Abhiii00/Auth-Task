const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
    getUsers,
} = require("../controller/user");

router.get("/getUser", requireAuth,  getUsers);


module.exports = router;
