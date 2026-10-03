import bcrypt from "bcryptjs";
import User from "../tables/user.js";

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;

async function createUser(req, res) {
  const { fullName, email, password } = req.body;

  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return res
      .status(400)
      .json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ fullName, email, passwordHash });
  res.status(201).json(user);
}

async function getUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
}

async function updateUser(req, res) {
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
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(204).end();
}

export default {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
