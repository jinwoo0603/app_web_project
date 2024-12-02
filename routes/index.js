const express = require('express');
const router = express.Router();
const db = require('../config/db');

//메인 페이지 라우터
router.get('/', async (req, res) => {
    // 로그인된 사용자 정보 가져오기
    if (!req.user) {
        return res.redirect('/login'); // 비로그인 상태에서 로그인 페이지로 리다이렉트
    }

    const userId = req.user.id; // 현재 로그인한 유저의 ID

    try {
        // 사용자의 노트 가져오기
        const [notes] = await db.query('SELECT id, title FROM notes WHERE userId = ?', [userId]);

        // 노트 개수 및 사용자 이름 가져오기
        const noteCount = notes.length;
        const userName = req.user.name; // Passport 세션에서 사용자 이름 가져오기

        // main.html 템플릿 렌더링
        res.render('main', {
            userName: userName,
            noteCount: noteCount,
            notes: notes,
        });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).send('An error occurred while fetching your notes.');
    }
});

router.post('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        // Passport.js 세션 초기화
        req.logout((err) => {
            if (err) {
                console.error('Logout error:', err);
                return res.status(500).send('An error occurred while logging out.');
            }

            // 로그아웃 성공 시 응답
            res.status(200).send('Logged out successfully.');
        });
    } else {
        // 이미 인증되지 않은 상태
        res.status(400).send('You are not logged in.');
    }
});

module.exports = router;