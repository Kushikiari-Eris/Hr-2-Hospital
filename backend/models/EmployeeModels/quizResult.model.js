import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const QuizResultSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'AllCourses',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  answers: [{
    questionIndex: Number,
    selectedAnswer: String
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const QuizResult = model('QuizResult', QuizResultSchema);
export default QuizResult;
