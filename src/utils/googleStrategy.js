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
    "/api/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: config.FAILURE_URL,
      session: false,
    }),
    googleAuth,
    async (req, res, next) => {
      // Pass token via URL query param so client can set a same-origin cookie
      const redirectUrl = `${config.SUCCESS_URL}?token=${req.token}`;
      res.redirect(redirectUrl);
    }
  );
};

export default strategy;  