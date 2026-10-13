const studentControllers = require('../controllers/studentControllers');
const express = require('express');
const router = express.Router();

router
    .route('/')
    .get(studentControllers.getAll)
    .post(studentControllers.create);

router
    .route('/search')
    .post(studentControllers.searchByID);

router
    .route('/:id')
    .get(studentControllers.getOne)
    .patch(studentControllers.update)
    .delete(studentControllers.deleteStudent);

module.exports = router;