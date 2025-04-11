import express from "express"
import { getLessonsByCourse, getLesson, createLesson, updateLesson, deleteLesson } from "../../controllers/AdminControllers/lesson.controller.js"

const router = express.Router();


router.get('/course/:courseId', getLessonsByCourse);
router.get('/:id', getLesson);
router.post('/', createLesson);
router.put('/:id', updateLesson);
router.delete('/:id', deleteLesson);

export default router