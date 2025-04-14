import express from "express";
import {
  createSuccessionPlan,
  getAllSuccessionPlans,
  getSuccessionPlanById,
  updateSuccessionPlan,
  deleteSuccessionPlan,
  getSuccessionPlansByDepartment,
  getPotentialSuccessors,
  getSuccessionPlansForEmployee
} from "../../controllers/AdminControllers/successionPlan.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Regular user routes
router.get("/my-succession-plans", protectRoute, (req, res) => {
  req.params.userId = req.user._id;
  getSuccessionPlansForEmployee(req, res);
});


router.route("/")
  .post(createSuccessionPlan)
  .get(getAllSuccessionPlans);

router.route("/potential-successors")
  .get(getPotentialSuccessors);

router.route("/department/:department")
  .get(getSuccessionPlansByDepartment);

router.route("/employee/:userId")
  .get(getSuccessionPlansForEmployee);

router.route("/:id")
  .get(getSuccessionPlanById)
  .put(updateSuccessionPlan)
  .delete(deleteSuccessionPlan);

export default router;