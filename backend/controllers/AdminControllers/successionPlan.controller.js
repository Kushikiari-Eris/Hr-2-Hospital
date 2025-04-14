import SuccessionPlan from "../../models/AdminModels/successionPlan.model.js";
import User from "../../models/user.model.js";


// Create new succession plan
export const createSuccessionPlan = async (req, res) => {
  try {
    const {
      positionTitle,
      positionDescription,
      department,
      currentHolder,
      riskFactor,
      keyCompetencies,
      successors,
      nextReviewDate,
    } = req.body;

    // Validate current holder exists
    const holderExists = await User.findById(currentHolder);
    if (!holderExists) {
      return res.status(400).json({ message: "Current position holder not found" });
    }

    // Validate all successors exist
    if (successors && successors.length) {
      for (const successor of successors) {
        const successorExists = await User.findById(successor.userId);
        if (!successorExists) {
          return res.status(400).json({ message: `Successor with ID ${successor.userId} not found` });
        }
      }
    }

    const successionPlan = await SuccessionPlan.create({
      positionTitle,
      positionDescription,
      department,
      currentHolder,
      riskFactor,
      keyCompetencies,
      successors,
      nextReviewDate,
    });

    res.status(201).json(successionPlan);
  } catch (error) {
    console.error("Error creating succession plan:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all succession plans
export const getAllSuccessionPlans = async (req, res) => {
  try {
    const plans = await SuccessionPlan.find()
      .populate("currentHolder", "name email department position")
      .populate("successors.userId", "name email department position");
    
    res.json(plans);
  } catch (error) {
    console.error("Error fetching succession plans:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get succession plan by ID
export const getSuccessionPlanById = async (req, res) => {
  try {
    const plan = await SuccessionPlan.findById(req.params.id)
      .populate("currentHolder", "name email department position")
      .populate("successors.userId", "name email department position");
    
    if (!plan) {
      return res.status(404).json({ message: "Succession plan not found" });
    }
    
    res.json(plan);
  } catch (error) {
    console.error("Error fetching succession plan:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update succession plan
export const updateSuccessionPlan = async (req, res) => {
  try {
    const {
      positionTitle,
      positionDescription,
      department,
      currentHolder,
      riskFactor,
      keyCompetencies,
      successors,
      nextReviewDate,
      status,
    } = req.body;

    // Validate current holder exists if provided
    if (currentHolder) {
      const holderExists = await User.findById(currentHolder);
      if (!holderExists) {
        return res.status(400).json({ message: "Current position holder not found" });
      }
    }

    // Validate all successors exist if provided
    if (successors && successors.length) {
      for (const successor of successors) {
        const successorExists = await User.findById(successor.userId);
        if (!successorExists) {
          return res.status(400).json({ message: `Successor with ID ${successor.userId} not found` });
        }
      }
    }

    const updatedPlan = await SuccessionPlan.findByIdAndUpdate(
      req.params.id,
      {
        positionTitle,
        positionDescription,
        department,
        currentHolder,
        riskFactor,
        keyCompetencies,
        successors,
        nextReviewDate,
        status,
        lastReviewDate: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ message: "Succession plan not found" });
    }

    res.json(updatedPlan);
  } catch (error) {
    console.error("Error updating succession plan:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Delete succession plan
export const deleteSuccessionPlan = async (req, res) => {
  try {
    const plan = await SuccessionPlan.findByIdAndDelete(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ message: "Succession plan not found" });
    }
    
    res.json({ message: "Succession plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting succession plan:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get succession plans by department
export const getSuccessionPlansByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    
    const plans = await SuccessionPlan.find({ department })
      .populate("currentHolder", "name email department position")
      .populate("successors.userId", "name email department position");
    
    res.json(plans);
  } catch (error) {
    console.error("Error fetching succession plans by department:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get potential successors for a position
export const getPotentialSuccessors = async (req, res) => {
  try {
    const { department, positionTitle } = req.query;
    
    const query = {};
    if (department) query.department = department;
    
    // Find all employees in the department
    const potentialSuccessors = await User.find(query).select("name email department position");
    
    res.json(potentialSuccessors);
  } catch (error) {
    console.error("Error fetching potential successors:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all succession plans for an employee (where they are identified as a successor)
export const getSuccessionPlansForEmployee = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const plans = await SuccessionPlan.find({
      "successors.userId": userId
    })
    .populate("currentHolder", "name email department position")
    .populate("successors.userId", "name email department position");
    
    res.json(plans);
  } catch (error) {
    console.error("Error fetching succession plans for employee:", error.message);
    res.status(500).json({ message: error.message });
  }
};