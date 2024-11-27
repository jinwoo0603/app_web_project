const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./db');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // 사용자 검색
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
          return done(null, false, { message: 'No user with that username' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      if (rows.length === 0) {
        return done(null, false);
      }
      done(null, rows[0]);
    } catch (error) {
      done(error);
    }
  });
};
