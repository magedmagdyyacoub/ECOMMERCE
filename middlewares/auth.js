// middlewares/auth.js
module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to view that resource.");
    res.redirect("/login");
  },

  ensureAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "admin") {
      return next();
    }
    req.flash("error_msg", "You are not authorized to view this page.");
    res.redirect("/home");
  },

  setUser: (req, res, next) => {
    res.locals.user = req.user || { username: "Guest" };
    next();
  }
};
