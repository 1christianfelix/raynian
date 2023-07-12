const User = require("../models/UserModel");
const Stats = require("../models/StatsModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "7d" });
};

// get all users
const getusers = async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });

  res.status(200).json(users);
};

// get a single user
const getuser = async (req, res) => {
  const { user } = req.params;

  // checking if the id being passed is a valid MongoDB type id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "user does not exist" });
  }

  if (!user) {
    return res.status(404).json({ error: "No such user" });
  }

  res.status(200).json(user);
};

const usernameChecker = async (req, res) => {
  const { username } = req.body;

  if (username.length === 0) {
    return res.json({
      msg: "Username required",
      valid_display: true,
      error: false,
    });
  }

  const findUsername = await User.findOne({ username: username });

  const alphanumericOptions = { ignore: "-._" }; // Ignore characters "-", ".", and "_"

  if (username.length > 25) {
    res.json({
      msg: "Username exceeds the maximum length of 25 characters",
      valid_display: true,
      error: false,
    });
  } else if (username.length < 4) {
    res.json({
      msg: "Username must be at least 4 characters",
      valid_display: true,
      error: false,
    });
  } else if (
    !validator.isAlphanumeric(username, "en-US", alphanumericOptions)
  ) {
    res.json({
      msg: "Username must be alphanumeric (allowing '-', '.', and '_')",
      valid_display: true,
      error: false,
    });
  } else if (findUsername) {
    res.json({
      msg: "Username already exist",
      valid_display: true,
      error: false,
    });
  } else {
    res.json({ msg: "Username available", valid_display: true, error: true });
  }
};

const emailChecker = async (req, res) => {
  const { email } = req.body;
  if (!validator.isEmail(email))
    return res.json({ msg: "Email Required", error: false });

  const findEmail = await User.findOne({ email: email });

  if (findEmail) {
    res.json({ msg: "Email already exist", error: false });
  } else {
    res.json({ msg: "Email is available", error: true });
  }
};

// signup
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  // add doc to db
  try {
    const user = await User.signup(email, username, password);

    // adding default pfp
    pfpRandomizer = Math.floor(Math.random() * 3) + 1;
    switch (pfpRandomizer) {
      case 1:
        user.profilePicture =
          "https://img.freepik.com/free-vector/cute-panda-sipping-boba-milk-tea-cartoon-icon-illustration-animal-food-icon-concept-isolated-flat-cartoon-style_138676-2173.jpg";
        break;
      case 2:
        user.profilePicture =
          "https://i.pinimg.com/736x/ef/26/df/ef26df0ce4f41d74cb48a4f139504619.jpg";
        break;
      case 3:
        user.profilePicture =
          "https://img.freepik.com/free-vector/cute-dinosaur-playing-guitar-music-cartoon-vector-icon-illustration-animal-technology-icon-isolated_138676-4729.jpg";
        break;
      default:
        user.profilePicture =
          "https://img.freepik.com/free-vector/cute-dinosaur-playing-guitar-music-cartoon-vector-icon-illustration-animal-technology-icon-isolated_138676-4729.jpg";
        break;
    }

    user.save();

    const token = createToken(user._id);

    // Create the stats object and link it to the user
    const stats = new Stats({ user: user._id });
    await stats.save();

    // Update the user's stats reference
    user.stats = stats._id;
    await user.save();
    await user.populate("stats");

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    req.session.user = {
      id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
      stats: user.stats,
      bio: user.bio,
      tasks: user.tasks,
    };
    console.log(req.session);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// login
const login = async (req, res) => {
  const { email = null, username = null, password = null } = req.body;
  try {
    const user = await User.login(email, username, password);

    const token = createToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    await user.populate("stats");

    req.session.user = {
      id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
      stats: user.stats,
      bio: user.bio,
      tasks: user.tasks,
    };
    console.log(req.session);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// logout
const logout = async (req, res) => {
  const { email = null, username = null, password = null } = req.body;
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update a user

module.exports = {
  getuser,
  getusers,
  signup,
  login,
  logout,
  usernameChecker,
  emailChecker,
};
