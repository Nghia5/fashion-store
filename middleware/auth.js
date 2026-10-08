exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  if (req.xhr || req.headers.accept?.includes("application/json")) {
    return res.status(401).json({ success: false, redirect: "/auth/login" });
  }
  req.flash("error", "Vui long dang nhap de tiep tuc");
  res.redirect("/auth/login");
};

exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.role === "admin") return next();
  if (req.xhr || req.headers.accept?.includes("application/json")) {
    return res.status(403).json({ success: false, message: "Khong co quyen" });
  }
  res.redirect("/");
};

exports.isGuest = (req, res, next) => {
  if (!req.session || !req.session.userId) return next();
  res.redirect("/");
};
