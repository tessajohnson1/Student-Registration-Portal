const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  registerStudent,
  loginStudent,
  getAllStudents,
  getStudentProfile,
  updateStudentProfile,
  deleteStudentProfile,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/studentController");

// Public Routes
router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/", getAllStudents);

// Protected Routes
router.get("/profile", authMiddleware, getStudentProfile);
router.put("/profile", authMiddleware, updateStudentProfile);
router.delete("/profile", authMiddleware, deleteStudentProfile);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;