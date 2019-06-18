const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      userName: req.body.userName,
      userNickname: req.body.userNickname
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Error signing up. Please try again."
        });
      });
  });
};

exports.login = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Invalid Credentials"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid Credentials"
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
          userName: fetchedUser.userName,
          userNickname: fetchedUser.userNickname
        },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        userName: fetchedUser.userName,
        userNickname: fetchedUser.userNickname,
        email: fetchedUser.email
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "You are not authenticated"
      });
    });
};
