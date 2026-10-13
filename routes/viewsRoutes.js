const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/student/:id', (req, res) => {
    res.render('student', { studentId: req.params.id });
});

module.exports = router;