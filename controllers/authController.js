const bcrypt = require("bcryptjs");
const { query } = require("../config/db");

exports.getLogin = (req, res) => {
  if (req.session.userId) return res.redirect("/");
  res.render("auth/login", { title: "Dang nhap" });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const r = await query("SELECT * FROM Users WHERE Email=@email AND IsActive=1", { email });
    const user = r.recordset[0];
    if (!user) { req.flash("error", "Email hoac mat khau khong dung"); return res.redirect("/auth/login"); }
    const ok = await bcrypt.compare(password, user.PasswordHash);
    if (!ok) { req.flash("error", "Email hoac mat khau khong dung"); return res.redirect("/auth/login"); }
    req.session.userId = user.Id;
    req.session.user = { Id: user.Id, Name: user.Name, Email: user.Email, Role: user.Role, Avatar: user.Avatar };
    req.session.role = user.Role;
    req.flash("success", "Chao mung " + user.Name + "!");
    if (user.Role === "admin") return res.redirect("/admin/dashboard");
    res.redirect("/");
  } catch (err) { console.error(err); req.flash("error", "Loi he thong"); res.redirect("/auth/login"); }
};

exports.getRegister = (req, res) => {
  if (req.session.userId) return res.redirect("/");
  res.render("auth/register", { title: "Dang ky", errors: [], formData: {} });
};

exports.postRegister = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) { req.flash("error", "Vui long dien day du thong tin"); return res.redirect("/auth/register"); }
    const exists = await query("SELECT Id FROM Users WHERE Email=@email", { email });
    if (exists.recordset.length > 0) { req.flash("error", "Email da ton tai"); return res.redirect("/auth/register"); }
    const hash = await bcrypt.hash(password, 12);
    await query("INSERT INTO Users (Name,Email,PasswordHash,Phone) VALUES (@name,@email,@hash,@phone)",
      { name, email, hash, phone: phone || null });
    req.flash("success", "Dang ky thanh cong! Vui long dang nhap.");
    res.redirect("/auth/login");
  } catch (err) { console.error(err); req.flash("error", "Loi dang ky"); res.redirect("/auth/register"); }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect("/"));
};

exports.getProfile = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect("/auth/login");
    const r = await query("SELECT * FROM Users WHERE Id=@id", { id: req.session.userId });
    const profileUser = r.recordset[0];
    const ordersR = await query("SELECT TOP 5 * FROM Orders WHERE UserId=@id ORDER BY CreatedAt DESC", { id: req.session.userId });
    res.render("auth/profile", { title: "Ho so cua toi", profileUser, recentOrders: ordersR.recordset });
  } catch (err) { console.error(err); res.redirect("/"); }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    await query("UPDATE Users SET Name=@name, Phone=@phone WHERE Id=@id", { name, phone: phone || null, id: req.session.userId });
    req.session.user.Name = name;
    req.flash("success", "Cap nhat thanh cong!");
    res.redirect("/auth/profile");
  } catch (err) { req.flash("error", "Loi cap nhat"); res.redirect("/auth/profile"); }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const r = await query("SELECT PasswordHash FROM Users WHERE Id=@id", { id: req.session.userId });
    const ok = await bcrypt.compare(currentPassword, r.recordset[0].PasswordHash);
    if (!ok) { req.flash("error", "Mat khau hien tai khong dung"); return res.redirect("/auth/profile"); }
    const hash = await bcrypt.hash(newPassword, 12);
    await query("UPDATE Users SET PasswordHash=@hash WHERE Id=@id", { hash, id: req.session.userId });
    req.flash("success", "Doi mat khau thanh cong!");
    res.redirect("/auth/profile");
  } catch (err) { req.flash("error", "Loi"); res.redirect("/auth/profile"); }
};

exports.toggleWishlist = async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ success: false, redirect: "/auth/login" });
    const { productId } = req.body;
    const exists = await query("SELECT 1 FROM Wishlist WHERE UserId=@uid AND ProductId=@pid", { uid: req.session.userId, pid: productId });
    if (exists.recordset.length > 0) {
      await query("DELETE FROM Wishlist WHERE UserId=@uid AND ProductId=@pid", { uid: req.session.userId, pid: productId });
      res.json({ success: true, wishlisted: false, message: "Da xoa khoi yeu thich" });
    } else {
      await query("INSERT INTO Wishlist (UserId,ProductId) VALUES (@uid,@pid)", { uid: req.session.userId, pid: productId });
      res.json({ success: true, wishlisted: true, message: "Da them vao yeu thich" });
    }
  } catch (err) { res.status(500).json({ success: false }); }
};
