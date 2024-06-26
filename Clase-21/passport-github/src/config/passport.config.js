import passport from "passport";
import GitHubStrategy from "passport-github2";
import userService from "../models/user.model.js";
import * as dotenv from "dotenv";
dotenv.config();
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

const initializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userService.findOne({
            email: profile?.emails[0]?.value,
          });
          if (!user) {
            const newUser = {
              first_name: profile.displayName.split(" ")[0],
              last_name: profile.displayName.split(" ")[1],
              email: profile?.emails[0]?.value,
              age: 18,
              password: Math.random().toString(36).substring(7),
            };
            let result = await userService.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userService.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
/*passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userService.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
*/

export default initializePassport;

/*import passport from "passport";


import local from "passport-local";
import User from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          console.log(username);

          const user = await User.findOne({ email: username });
          console.log("user", user);
          if (user) {
            return done(null, false, { message: "User already exists" });
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          console.log("aqui vamos bien");
          console.log(newUser);
          let result = await User.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error al obtener el usuario", error);
        }
      }
    )
  );

  

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await User.findById(id);
    done(null, user);
  });

  passport.use(
    "login",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "password",
      },
      async (req, username, password, done) => {
        try {
          const user = await User.findOne({ email: username });
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          console.log("user", user);
          if (!isValidPassword(user.password, password)) {
            return done(null, false, { message: "Wrong password" });
          } else {
            return done(null, user);
          }
        } catch (error) {
          console.log("aqui fallo");
          return done("Error al obtener el usuario", error);
        }
      }
    )
  );
};

export default initializePassport;
*/