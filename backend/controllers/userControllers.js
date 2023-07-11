const User = require('../models/userModel');

const registerController = async (req, res) => {
  const { name, email, password, pic } = req.body;

  // Check if all details are present in request body
  if (!name || !email || !password) {
    return res.status(400).send({
      error: 'Please provide all user details',
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send({
      error: 'User with this email already exists',
    });
  }

  try {
    const user = await User.create({
      name,
      email,
      password,
      ...(pic && { pic }),
    });
    // Generate jwt token
    const token = await user.generateJwtToken();
    res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token,
    });
  } catch (e) {
    res.status(400).send({
      error: e.message,
    });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({
      error: 'Please provide all details',
    });
  }

  try {
    // Find user by email and password
    const user = await User.findByEmailAndPassword(email, password);
    const token = await user.generateJwtToken();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token,
    });
  } catch (e) {
    res.status(400).send({
      error: e.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
};
