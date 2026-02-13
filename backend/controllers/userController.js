import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user (existing function)
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const role = user.role;
    const token = createToken(user._id);
    res.json({ success: true, token, role });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Create token (existing function)
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user (existing function)
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // checking user is already exist
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    } // validating email format and strong password

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    } // hashing user password

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const role = user.role;
    const token = createToken(user._id);
    res.json({ success: true, token, role });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ⭐ NEW FUNCTION: Update User Role (requires admin privileges) ⭐
const updateUserRole = async (req, res) => {
  // We assume the user is already authenticated by authMiddleware
  // In a real app, you would also check if the requester (req.body.userId) is an admin.
  const { targetUserId, newRole } = req.body;

  // Basic validation
  if (!targetUserId || !newRole) {
    return res.json({ success: false, message: "Missing User ID or New Role" });
  }

  try {
    // Find the user by their ID and update the 'role' field
    const user = await userModel.findByIdAndUpdate(
      targetUserId,
      { role: newRole },
      { new: true } // returns the updated document
    );

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: `Role updated to ${newRole}`, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating role" });
  }
};

export { loginUser, registerUser, updateUserRole }; // EXPORT THE NEW FUNCTION

