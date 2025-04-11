import express from "express"
import {getAllQuizzes, getQuizById, getQuizByLesson, createQuiz, updateQuiz, deleteQuiz, addQuestion, removeQuestion} from '../../controllers/AdminControllers/quiz.controller.js'
const router = express.Router();


// Quiz routes
router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.get('/lesson/:lessonId', getQuizByLesson);
router.post('/', createQuiz);
router.put('/:id', updateQuiz);
router.delete('/:id', deleteQuiz);

// Question routes (nested under quizzes)
router.post('/:id/questions', addQuestion);
router.delete('/:id/questions/:questionId', removeQuestion);

export default router;