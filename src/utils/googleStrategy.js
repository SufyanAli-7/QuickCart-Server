import googleStrategy  from "passport-google-oauth20";
import passport from "passport";
import googleAuth from "../middlewares/googleAuth.middleware.js";
import config from "../config/config.js";


const strategy = (app) => {
  passport.use(
    new googleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK,
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );

  app.get(
    "/api/auth/google",
    passport.authenticate("google", {
      scope: ["email", "profile"],
      prompt: "select_account",
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: config.FAILURE_URL,
      session: false,
    }),
    googleAuth,
    async (req, res, next) => {
      res.redirect(config.SUCCESS_URL);
    }
  );
};

export default strategy;  