const User = require("../models/UserModel");

module.exports.getAllUsers = async (req, res) => {
  const allUsers = (await User.find().select("-__v")).sort({ createdAt: -1 });

  if (!allUsers || allUsers.lenght === 0) {
    throw new Error("No users found in database");
  }

  res.status(200).json({
    message: "User fetch successfully",
    users: allUsers,
  });
};

module.exports.createUser = async (req, res) => {
  const { userName, mobileNumber, password } = req.body;

  if (!userName || !mobileNumber, !password) {
    return res.status(400).json({ err: "Mobile Number, userName and password are required" });
  }

  const newUser = new User({
    userName,
    mobileNumber,
    password
  });

  const savedUser = await newUser.save();

  res.status(201).json(savedUser);
};

module.exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !["Viewer", "Analyst", "Admin"].includes(role)) {
    return res.stauts(400).json({
      error: "A valid role is required 'Admin', 'Analyst' , 'Admin' ",
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { role },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedUser) {
    return res.status(404).json({ error: "User Not found" });
  }

  res
    .status(200)
    .json({ message: "Role updated sucessfully", user: updatedUser });
};

module.exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["Active", "Inactive"].includes(status)) {
    return res.status(400).json({
      error: "A valid status Active or Inactive is required",
    });
  }
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedUser) {
    return res.status(404).json({ error: "User not Found" });
  }

  res
    .status(200)
    .json({ message: "Status updated Successfully", user: updatedUser });
};

module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) return res.status(404).json({ err: "User Not Found" });

  res
    .status(200)
    .json({ message: "User deleted successfully", user: deletedUser });
};
