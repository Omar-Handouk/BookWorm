"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");

const authService
  = require("../services/service-manager").get("authService");

module.exports = (app) => {

  router.get("/login", (req, res) => {
    if (!req.user) {
      res.render("login",
        { pageTitle: "Login", loggedIn: false });
    } else {
      res.render("profile",
        {
          user: req.user,
          pageTitle: "Profile",
          loggedIn: true,
          userType: req.user.userType === "buyer"
        });
    }
  });

  router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  router.get("/google", passport.authenticate("google",
    { scope: ["profile", "email"] }));

  router.get("/google/redirect", passport.authenticate("google"),
    (req, res) => {
      res.redirect("/profile");
    });

  router.get('/', authService.authenticate, (req, res) => {
    res.redirect('/profile');
  });

  app.use("/auth", router);
};