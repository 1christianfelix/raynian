const passport = require("passport");

/* OAuth Login Operations */
// Handle successful login
async function loginSuccess(req, res) {
  const user = req.user || null;
  await user.populate("stats");
  if (req.user) {
    req.session.user = {
      id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
      stats: user.stats,
      bio: user.bio,
      tasks: user.tasks,
    };
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
}

// Handle failed login
function loginFailed(req, res) {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
}

/* OAuth Google Authentication Operations */
// Start Google authentication process
function googleAuth(req, res) {
  passport.authenticate("google", { scope: ["profile", "email"] });
}

// Handle Google authentication callback
function googleCallback(req, res) {
  passport.authenticate("google", {
    successRedirect: `http://localhost:3000/auth/login/success`,
    failureRedirect: `${process.env.CLIENT_URL}/failed`,
  });
}

/* OAuth Logout Operation */
// Handle logout
function logout(req, res) {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
}

module.exports = {
  loginSuccess,
  loginFailed,
  googleAuth,
  googleCallback,
  logout,
};
