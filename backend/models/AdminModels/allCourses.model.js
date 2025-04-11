
import mongoose from "mongoose";

const AllCoursesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,  // Stores Cloudinary URL
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AllCourses = mongoose.model("AllCourses", AllCoursesSchema);

export default AllCourses;
