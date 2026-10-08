require("dotenv").config();
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const path = require("path");
const { getPool, query } = require("./config/db");

const app = express();

process.on("unhandledRejection", (err) => console.error("Unhandled:", err && err.message));
process.on("uncaughtException", (err) => console.error("Uncaught:", err && err.message));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(methodOverride((req) => {
  if (req.body && "_method" in req.body) {
    const m = req.body._method; delete req.body._method; return m;
  }
}));

async function startServer() {
  await getPool();

  app.use(session({
    secret: process.env.SESSION_SECRET || "fashion-store-2024",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
  }));
  app.use(flash());

  // Global locals
  app.use(async (req, res, next) => {
    try {
      res.locals.user = req.session.user || null;
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      res.locals.currentPath = req.path;
      res.locals.cartCount = 0;
      if (req.session.userId) {
        try {
          const r = await query(
            "SELECT ISNULL(SUM(ci.Quantity),0) as cnt FROM CartItems ci INNER JOIN Carts c ON c.Id=ci.CartId WHERE c.UserId=@uid",
            { uid: req.session.userId }
          );
          res.locals.cartCount = r.recordset[0]?.cnt || 0;
        } catch (_) {}
      }
      next();
    } catch (err) { next(err); }
  });

  app.use("/", require("./routes/index"));
  app.use("/auth", require("./routes/auth"));
  app.use("/products", require("./routes/products"));
  app.use("/cart", require("./routes/cart"));
  app.use("/orders", require("./routes/orders"));
  app.use('/admin', require('./routes/admin'));
  app.use('/api', require('./routes/api'));

  app.get("/wishlist", async (req, res) => {
    try {
      if (!req.session.userId) return res.redirect("/auth/login");
      const r = await query(
        "SELECT p.*, c.Name as CategoryName FROM Wishlist w INNER JOIN Products p ON p.Id=w.ProductId LEFT JOIN Categories c ON c.Id=p.CategoryId WHERE w.UserId=@uid",
        { uid: req.session.userId }
      );
      const products = r.recordset.map(p => ({
        ...p, _id: p.Id, slug: p.Slug, name: p.Name,
        price: parseFloat(p.Price), salePrice: p.SalePrice ? parseFloat(p.SalePrice) : null,
        images: (() => { try { return JSON.parse(p.Images||"[]"); } catch { return []; } })(),
        category: { name: p.CategoryName || "" }
      }));
      res.render("wishlist", { title: "Yeu thich", products });
    } catch (err) { res.redirect("/"); }
  });

  app.use((req, res) => {
    try { res.status(404).render("404", { title: "404", user: res.locals.user, cartCount: 0, success: [], error: [] }); }
    catch (e) { res.status(404).send("404 - Trang khong ton tai"); }
  });

  app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    try { res.status(500).render("404", { title: "500", message: err.message, user: res.locals.user, cartCount: 0, success: [], error: [] }); }
    catch (e) { res.status(500).send("500 - Loi may chu"); }
  });

  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log("Fashion Store running at http://localhost:" + PORT);
    console.log("Admin: http://localhost:" + PORT + "/admin");
  });
  server.keepAliveTimeout = 65000;
}

startServer().catch(console.error);


