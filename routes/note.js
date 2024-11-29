const express = require('express');
const router = express.Router();
const db = require('../config/db');
const marked = require('marked');

router.get('/', (req, res) => {
    res.render('write', { title:"", content: "" });
});
//views 폴더의 write에 매개변수로 {content:""}를 렌더

// 노트 저장 라우터
router.post('/', async (req, res) => {
    if (!req.user) {
        return res.status(401).send('Unauthorized');
    }

    const userId = req.user.id; // Passport 세션에서 로그인한 사용자 ID 가져오기
    const { title, content } = req.body; // 요청 본문에서 title과 content 가져오기

    if (!title || !content) {
        return res.status(400).send('Title and content are required.');
    }

    try {
        // notes 테이블에 데이터 삽입
        const [result] = await db.query(
            'INSERT INTO notes (userId, title, content) VALUES (?, ?, ?)',
            [userId, title, content]
        );

        if (result.affectedRows === 1) {
            // 성공적으로 삽입 후 메인 페이지로 리다이렉트
            res.redirect('http://localhost:8000');
        } else {
            res.status(500).send('Failed to create note.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while creating the note.');
    }
});

router.get('/:noteId', async (req, res) => {
    const noteId = req.params.noteId;

    try {
        // notes 테이블에서 해당 ID에 해당하는 title과 content 가져오기
        const [rows] = await db.query('SELECT title, content FROM notes WHERE id = ?', [noteId]);

        if (rows.length === 0) {
            return res.status(404).send('Note not found.');
        }

        const title = rows[0].title;
        const content = marked(rows[0].content); // 마크다운을 HTML로 변환

        // doc 템플릿 렌더링
        res.render('doc', { title: title, content: content });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching the note.');
    }
});
//notes 테이블에서 id 항목이 id파라미터인 컬럼의 title값과 content값을 가져옴
//marked 라이브러리로 마크다운 파싱한 값 content 변수에 할당
//views 폴더의 doc에 매개변수로 {title:title, content:content}를 렌더

router.delete('/:noteId', async (req, res) => {
    const noteId = req.params.noteId;

    try {
        // notes 테이블에서 해당 ID에 해당하는 노트 삭제
        const [result] = await db.query('DELETE FROM notes WHERE id = ?', [noteId]);

        if (result.affectedRows === 0) {
            return res.status(404).send('Note not found.');
        }

        res.status(200).send('Note deleted successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while deleting the note.');
    }
});
//notes 테이블에서 id 항목이 id파라미터인 컬럼을 삭제

router.get('/:noteId/edit', async (req, res) => {
    const noteId = req.params.noteId;

    try {
        // notes 테이블에서 해당 ID에 해당하는 title과 content 가져오기
        const [rows] = await db.query('SELECT title, content FROM notes WHERE id = ?', [noteId]);

        if (rows.length === 0) {
            return res.status(404).send('Note not found.');
        }

        const title = rows[0].title;
        const content = rows[0].content; // 마크다운 원본 그대로 사용

        // write 템플릿 렌더링
        res.render('write', { title: title, content: content });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching the note for editing.');
    }
});
//notes 테이블에서 id 항목이 id파라미터인 컬럼의 title값과 content값을 가져옴
//marked 라이브러리로 마크다운 파싱한 값 content 변수에 할당
//views 폴더의 write에 매개변수로 {title:title, content:content}를 렌더

module.exports = router;