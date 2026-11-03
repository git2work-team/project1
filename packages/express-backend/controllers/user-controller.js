import bcrypt from "bcryptjs";
import User from "../tables/user.js";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;

function createToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
}

async function createUser(req, res) {
  const { fullName, email, password } = req.body;

  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return res
      .status(400)
      .json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await User.create({ fullName, email, passwordHash });
    res.status(201).json({ token: createToken(user), user });
  } catch (error) {
    // 11000 = duplicate key, the email is already used by another account
    if (error.code === 11000) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Please fill in your name and a valid email" });
    }
    throw error;
  }
}

// Checks the email and password. Sends back the user (without the password) if they match.
async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // passwordHash is hidden by default (select: false), so ask for it here
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+passwordHash");
  const passwordMatches = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!passwordMatches) {
    return res.status(401).json({ error: "Incorrect email or password" });
  }
  res.json({ token: createToken(user), user });
}

async function getUserById(req, res) {
  if (req.params.id !== req.user.id) {
    return res.status(403).json({ error: "You can only access your own account" });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
}

async function updateUser(req, res) {
  if (req.params.id !== req.user.id) {
    return res.status(403).json({ error: "You can only access your own account" });
  }

  const { fullName, email } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { fullName, email },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
}

async function deleteUser(req, res) {
  if (req.params.id !== req.user.id) {
    return res.status(403).json({ error: "You can only access your own account" });
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(204).end();
}

export default {
  createUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
};
