import mongoose from "mongoose";

const successorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  readiness: {
    type: String,
    enum: ["Ready Now", "Ready in 1-2 Years", "Ready in 3+ Years"],
    required: true
  },
  developmentNeeds: [String],
  notes: String
});

const successionPlanSchema = new mongoose.Schema(
  {
    positionTitle: {
      type: String,
      required: [true, "Position title is required"],
    },
    positionDescription: {
      type: String,
      required: [true, "Position description is required"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
    },
    currentHolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    riskFactor: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      required: true,
    },
    keyCompetencies: [String],
    successors: [successorSchema],
    lastReviewDate: {
      type: Date,
      default: Date.now,
    },
    nextReviewDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Archived"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const SuccessionPlan = mongoose.model("SuccessionPlan", successionPlanSchema);

export default SuccessionPlan;