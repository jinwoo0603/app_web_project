const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 관리자 인증 미들웨어
function isAdmin(req, res, next) {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).send('Access denied. Admins only.');
    }
    next();
}

// 관리자 대시보드
router.get('/', isAdmin, async (req, res) => {
    try {
        // 모든 유저 가져오기
        const [users] = await db.query(`
            SELECT users.id, users.name, users.email FROM users
            LEFT JOIN notes ON users.id = notes.userId
            GROUP BY users.id
        `);
        const [notes] = await db.query(`
            SELECT notes.id, notes.userId, notes.title FROM notes
            GROUP BY notes.id
        `);

        res.render('admin', { users, notes });
    } catch (error) {
        console.error('Error fetching admin data:', error);
        res.status(500).send('An error occurred while loading the admin page.');
    }
});

// 유저 삭제
router.delete('/user/:id', isAdmin, async (req, res) => {
    const userId = req.params.id;

    try {
        // 유저 삭제 (해당 유저의 노트도 삭제)
        await db.query('DELETE FROM notes WHERE userId = ?', [userId]);
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).send('User not found.');
        }

        res.status(200).send('User deleted successfully.');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('An error occurred while deleting the user.');
    }
});

// 노트 삭제
router.delete('/note/:id', isAdmin, async (req, res) => {
    const noteId = req.params.id;

    try {
        const [result] = await db.query('DELETE FROM notes WHERE id = ?', [noteId]);

        if (result.affectedRows === 0) {
            return res.status(404).send('Note not found.');
        }

        res.status(200).send('Note deleted successfully.');
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).send('An error occurred while deleting the note.');
    }
});

module.exports = router;