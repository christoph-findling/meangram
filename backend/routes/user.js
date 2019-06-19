const express = require("express");

const userController = require("../controllers/user");

const fileExtractor = require("../middleware/file");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.put("/update", checkAuth, fileExtractor, userController.update);

module.exports = router;
