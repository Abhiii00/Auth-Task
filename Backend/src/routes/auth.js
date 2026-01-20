const router = require("express").Router();
const { register, login, refresh, logout, forgotPassword, resetPassword } = require("../controller/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post('/forgotPassword', forgotPassword)
router.post('/resetPassword', resetPassword)

module.exports = router;
