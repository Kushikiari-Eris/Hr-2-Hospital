import mongoose from 'mongoose';

const TrainingCourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'pdf', 'class'],
    required: true
  },
  content: {
    type: String, // URL for video/pdf or details for class
    required: true
  },
  duration: {
    type: Number, // Duration in minutes
    required: true
  },
  expiryPeriod: {
    type: Number, // Number of months before certification expires
    default: 12
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const TrainingCourse = mongoose.model('TrainingCourse', TrainingCourseSchema);

export default TrainingCourse