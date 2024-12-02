const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../config/db');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' }, // email을 username으로 매핑
      async (email, password, done) => {
        try {
          // users 테이블에서 email로 사용자 검색
          const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
          if (rows.length === 0) {
              return done(null, false, { message: 'No user with that email' });
          }

          const user = rows[0];

          // 비밀번호 비교
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
              return done(null, false, { message: 'Incorrect password' });
          }

          return done(null, user);
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      if (rows.length === 0) {
          return done(null, false);
      }
      return done(null, rows[0]);
    } catch (error) {
      console.error(error);
      return done(error);
    }
  });
};
