import express from "express";
// 1. IMPORT THE NEW CONTROLLER FUNCTION
import {
  loginUser,
  registerUser,
  updateUserRole,
} from "../controllers/userController.js";
// 2. IMPORT THE AUTHENTICATION MIDDLEWARE
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// ⭐ NEW ROUTE: Role Update Endpoint ⭐
// The authMiddleware ensures this route is protected.
userRouter.post("/role", authMiddleware, updateUserRole);

export default userRouter;
