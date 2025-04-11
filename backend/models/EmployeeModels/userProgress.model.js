import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const UserProgressSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'AllCourses',
    required: true
  },
  completedLessons: [{
    type: Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  completedQuizzes: [{
    type: Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Ensure unique progress per course per user
UserProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const UserProgress = model('UserProgress', UserProgressSchema);
export default UserProgress;
