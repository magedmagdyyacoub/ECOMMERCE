const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pool = require('./config/db');

function initialize(passport) {
  const authenticateUser = async (username, password, done) => {
    try {
      // Fetch user from the database
      const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = rows[0];

      // Check if user exists
      if (!user) {
        return done(null, false, { message: 'No user with that username' });
      }

      // Compare password with hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // Attach role to user object (default to 'user' if undefined)
        return done(null, { ...user, role: user.role || 'user' });
      }

      // Password incorrect
      return done(null, false, { message: 'Password incorrect' });
    } catch (err) {
      return done(err);
    }
  };

  // Use LocalStrategy for authentication
  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));

  // Serialize user ID into the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user object from the session
  passport.deserializeUser(async (id, done) => {
    try {
      // Fetch user from the database using the ID
      const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      const user = rows[0];

      if (user) {
        // Attach role to user object (default to 'user' if undefined)
        return done(null, { ...user, role: user.role || 'user' });
      }

      // User not found
      return done(new Error('User not found'));
    } catch (err) {
      return done(err);
    }
  });
}

module.exports = initialize;
