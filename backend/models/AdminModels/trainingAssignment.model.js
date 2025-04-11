import mongoose from 'mongoose';

const TrainingAssignmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingCourse',
    required: true
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  completionDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'expired'],
    default: 'pending'
  },
  certificationExpiry: {
    type: Date,
    default: null
  }
});

const TrainingAssignment = mongoose.model('TrainingAssignment', TrainingAssignmentSchema);

export default TrainingAssignment