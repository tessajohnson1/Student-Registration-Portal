const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Student
const registerStudent = async (req, res) => {
  try {
    const { name, email, password, phone, department, year } = req.body;

    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      phone,
      department,
      year,
    });

    res.status(201).json({
      message: "Student Registered Successfully",
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        department: student.department,
        year: student.year,
        createdAt: student.createdAt,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login Student
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({
        message: "Student not found",
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        department: student.department,
        year: student.year,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select("-password");

    res.status(200).json({
      count: students.length,
      students,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Student Profile
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).select("-password");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json(student);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Student Profile
const updateStudentProfile = async (req, res) => {
  try {
    const { name, phone, department, year } = req.body;

    const student = await Student.findById(req.student.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    student.name = name || student.name;
    student.phone = phone || student.phone;
    student.department = department || student.department;
    student.year = year || student.year;

    await student.save();

    res.status(200).json({
      message: "Profile Updated Successfully",
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        department: student.department,
        year: student.year,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Student Profile
const deleteStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    await Student.findByIdAndDelete(req.student.id);

    res.status(200).json({
      message: "Student account deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check whether student exists
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Generate reset token
    const crypto = require("crypto");
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token and expiry
    student.resetPasswordToken = resetToken;
    student.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await student.save();

    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS Length:", process.env.EMAIL_PASS?.length);

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

await transporter.verify();
console.log("✅ SMTP connection successful");

    // Frontend URL
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>

        <p>Hello ${student.name},</p>

        <p>Click the button below to reset your password.</p>

        <a href="${resetURL}"
           style="
             background:#007bff;
             color:white;
             padding:10px 20px;
             text-decoration:none;
             border-radius:5px;
             display:inline-block;
           ">
           Reset Password
        </a>

        <br><br>

        <p>Or copy this link into your browser:</p>

        <p>${resetURL}</p>

        <p>This link will expire in 10 minutes.</p>
      `,
    };

    console.log("Sending email...");

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully!");

    res.status(200).json({
      success: true,
      message: "Password reset link sent successfully.",
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const student = await Student.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!student) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    student.password = hashedPassword;
    student.resetPasswordToken = undefined;
    student.resetPasswordExpire = undefined;

    await student.save();

    res.status(200).json({
      message: "Password reset successful",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const student = await Student.findById(req.student.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      student.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    student.password = hashedPassword;

    await student.save();

    res.status(200).json({
      message: "Password changed successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  getAllStudents,
  getStudentProfile,
  updateStudentProfile,
  deleteStudentProfile,
  forgotPassword,
  resetPassword,
  changePassword,
};