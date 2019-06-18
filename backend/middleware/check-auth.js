const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId,
      userName: decodedToken.userName,
      userNickname: decodedToken.userNickname
    };
    next();
  } catch (err) {
    res.status(401).json({
      message: "Auth failed, invalid token"
    });
  }
};
