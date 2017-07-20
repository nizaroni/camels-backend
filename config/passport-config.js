const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;


const UserModel = require('../models/user-model');


// Save the user's ID in the bowl (called when user logs in)
passport.serializeUser((userFromDb, next) => {
    next(null, userFromDb._id);
});


// Retrieve the user's info from the DB with the ID we got from the bowl
passport.deserializeUser((idFromBowl, next) => {
    UserModel.findById(
      idFromBowl,
      (err, userFromDb) => {
          if (err) {
            next(err);
            return;
          }

          next(null, userFromDb);
      }
    );
});


// email & password login strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'blahEmail',    // sent through AJAX from Angular
    passwordField: 'blahPassword'  // sent through AJAX from Angular
  },
  (theEmail, thePassword, next) => {

      UserModel.findOne(
        { email: theEmail },
        (err, userFromDb) => {
            if (err) {
              next(err);
              return;
            }

            if (userFromDb === null) {
              next(null, false, { message: 'Incorrect email 💩' });
              return;
            }

            if (bcrypt.compareSync(thePassword, userFromDb.encryptedPassword) === false) {
              next(null, false, { message: 'Incorrect password 💩' });
              return;
            }

            next(null, userFromDb);
        }
      ); // close UserModel.findOne()

  } // close (theEmail, thePassword, next) => {
));
