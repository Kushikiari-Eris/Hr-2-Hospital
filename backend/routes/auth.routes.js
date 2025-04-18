import express from "express";
import {
  signup,
  logout,
  login,
  refreshToken,
  getProfile,
  getAllUsers,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/logout", logout);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);
router.get("/fetchUsers", protectRoute, getAllUsers);

export default router;
