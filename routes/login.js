const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const path = require('path');

const router = express.Router();

// 로그인 GET 요청
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/signin.html'));
});

// 로그인 POST 요청 (추후 마저 작성)
router.post(
  '/',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '',
  })
);

// 회원가입 GET 요청
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/signup.html'));
});

// 회원가입 POST 요청
router.post('/register', async (req, res) => {
  const { name, password, passwordCheck, phoneNumber, email } = req.body;

  // 입력값 유효성 검사
  if (!name || !password || !passwordCheck || !phoneNumber || !email) {
    return res.status(400).send('빈 칸을 모두 입력해주세요.');
  }

  if (password !== passwordCheck) {
    return res.status(400).send('비밀번호 확인란을 다시 확인해주세요.');
  }

  try {
    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 추가 쿼리 실행
    await db.query(
      'INSERT INTO users (name, password, phone_number, email) VALUES (?, ?, ?, ?)',
      [name, hashedPassword, phoneNumber, email]
    );

    // 성공 시 로그인 페이지로 리디렉션
    res.redirect('/login');
  } catch (error) {
    // 이메일 또는 기타 중복 오류 처리
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).send('이메일 또는 전화번호가 이미 존재합니다.');
    } else {
      res.status(500).send('에러 발생. 나중에 다시 시도해주세요.');
    }
  }
});

module.exports = router;
