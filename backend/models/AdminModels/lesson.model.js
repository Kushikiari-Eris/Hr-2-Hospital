import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AllCourses',
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['video', 'document', 'link', 'other'],
      default: 'other'
    }
  }],
  duration: {
    type: Number, // in minutes
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add index to improve query performance
lessonSchema.index({ courseId: 1, order: 1 });

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson