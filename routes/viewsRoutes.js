const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/create', (req, res) => {
    res.render('create');
});

router.get('/student/:id', (req, res) => {
    res.render('student', { studentId: req.params.id });
});

module.exports = router;