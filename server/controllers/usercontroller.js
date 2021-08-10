const router = require("express").Router();
const User = require("../db").import("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/* ********************************
 *** USER REGISTER ****
 ******************************** */

 router.post("/register", function (req, res) {
    User.create({
      email: req.body.user.email,
      password: bcrypt.hashSync(req.body.user.password, 13),
    })
      .then(function createSuccess(user) {
        const token = jwt.sign({ id: user.id }, "i_am_secret", {
          expiresIn: 60 * 60 * 24,
        });
  
        res.status(200).json({
          user: user,
          message: "User succesfully created",
          sessionToken: token,
        });
      })
      .catch((err) => res.status(500).json({ error: "err" }));
  });
  
  
  /* ********************************
   *** USER LOGIN ****
   ******************************** */
  
  router.post("/login", function (req, res) {
    User.findOne({ where: { email: req.body.user.email } })
      .then(function loginSuccess(user) {
        if (user) {
          bcrypt.compare(
            req.body.user.password,
            user.password,
            function (err, matches) {
              if (matches) {
                let token = jwt.sign({ id: user.id }, "i_am_secret", {
                  expiresIn: 60 * 60 * 24,
                });
                res.status(200).json({
                  user: user,
                  message: "user succesfully logged in!",
                  sessionToken: token,
                });
              } else {
                res.status(502).send({ error: "Login Failed" });
              }
            }
          );
        } else {
          res.status(500).json({ error: "user does not exist" });
        }
      })
      .catch((err) => res.status(500).json({ error: err }));
  });
  
  module.exports = router;
  