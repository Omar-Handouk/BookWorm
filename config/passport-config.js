"use strict";

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const db = require("firebase-admin").firestore();
const serviceCredentials = require("./google_oauth_credentails");

passport.serializeUser((user, done) => {
  done(null, user.googleId);
});

passport.deserializeUser((userId, done) => {
  db
    .collection("Users")
    .doc(userId)
    .get()
    .then(doc => {

      if (doc.exists) {
        done(null, doc.data());
      } else {
        console.error("User was not found, passport-config.js:22");
      }

    })
    .catch(err => console.error(err));
});

let GoogleStrategyOptions = {
  clientID: serviceCredentials.web.client_id,
  clientSecret: serviceCredentials.web.client_secret,
  callbackURL: "/auth/google/redirect"
};

let GoogleStrategyCallback = (accessToken, refreshToken, profile, done) => {
  let profileId = profile.id;

  let profileEmail;
  if (profile.emails && profile.emails.length !== 0) {
    profileEmail = profile.emails[0].value;
  }

  let documentRef = db.collection("Users").doc(profileId);

  documentRef
    .get()
    .then(doc => {

      if (doc.exists) {
        done(null, doc.data());
      } else {

        let userInfo = {
          googleId: profileId,
          email: profileEmail,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          favouriteCars: [],
          bookedCars: [],
          userType: "buyer"
        };

        documentRef
          .set(userInfo)
          .then(doc => {
            done(null, userInfo);
          })
          .catch(err => console.error(err));
      }
    })
    .catch(err => console.error(err));
};

passport
  .use("google",
    new GoogleStrategy(GoogleStrategyOptions, GoogleStrategyCallback));
