const { query } = require("../config/db");
const slugify = require("slugify");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../public/uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
exports.upload = multer({ storage, limits: { fileSize: 5*1024*1024 } });

const parseImgs = (p) => ({ ...p, images: (() => { try { return JSON.parse(p.Images||"[]"); } catch { return []; } })() });

exports.getDashboard = async (req, res) => {
  try {
    const [revR,ordR,proR,usrR,penR,recR,topR] = await Promise.all([
      query("SELECT ISNULL(SUM(TotalPrice),0) as v FROM Orders WHERE OrderStatus='delivered'"),
      query("SELECT COUNT(*) as v FROM Orders"),
      query("SELECT COUNT(*) as v FROM Products WHERE IsActive=1"),
      query("SELECT COUNT(*) as v FROM Users WHERE Role='user'"),
      query("SELECT COUNT(*) as v FROM Orders WHERE OrderStatus='pending'"),
      query("SELECT TOP 5 * FROM Orders ORDER BY CreatedAt DESC"),
      query("SELECT TOP 5 p.Id,p.Name,p.Price,p.SalePrice,p.Sold,p.Images FROM Products p WHERE p.IsActive=1 ORDER BY p.Sold DESC")
    ]);
    res.render("admin/dashboard", {
      title: "Dashboard",
      totalRevenue: parseFloat(revR.recordset[0].v), totalOrders: ordR.recordset[0].v,
      totalProducts: proR.recordset[0].v, totalUsers: usrR.recordset[0].v,
      pendingOrders: penR.recordset[0].v, recentOrders: recR.recordset,
      topProducts: topR.recordset.map(parseImgs)
    });
  } catch (err) { console.error(err); res.render("admin/dashboard", { title:"Dashboard",totalRevenue:0,totalOrders:0,totalProducts:0,totalUsers:0,pendingOrders:0,recentOrders:[],topProducts:[] }); }
};

exports.getProducts = async (req, res) => {
  try {
    const filters = req.query || {};
    const r = await query("SELECT p.*,c.Name as CategoryName FROM Products p LEFT JOIN Categories c ON c.Id=p.CategoryId ORDER BY p.CreatedAt DESC");
    const cats = await query("SELECT * FROM Categories WHERE IsActive=1");
    res.render("admin/products", { 
      title: "Sản phẩm", 
      products: r.recordset.map(parseImgs), 
      categories: cats.recordset,
      filters: filters,
      total: r.recordset.length,
      totalPages: 1,
      currentPage: 1
    });
  } catch (err) { console.error("ADMIN ROUTE ERROR:", err); res.status(500).send("ERROR: " + err.message); }
};

exports.getProductForm = async (req, res) => {
  const cats = await query("SELECT * FROM Categories WHERE IsActive=1");
  let product = null;
  if (req.params.id) {
    const r = await query("SELECT * FROM Products WHERE Id=@id", { id: req.params.id });
    product = r.recordset[0] ? parseImgs(r.recordset[0]) : null;
  }
  res.render("admin/product-form", { title: product ? "Sửa sản phẩm" : "Thêm sản phẩm", product, categories: cats.recordset });
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, categoryId, gender, brand, price, salePrice, tags, isFeatured, isNewArrival } = req.body;
    let images = [];
    if (req.files && req.files.length > 0) images = req.files.map(f => "/uploads/" + f.filename);
    else if (req.body.imageUrls) images = req.body.imageUrls.split("\n").map(u=>u.trim()).filter(Boolean);
    const slug = slugify(name, { lower: true, strict: true }) + "-" + Date.now();
    await query(
      "INSERT INTO Products (Name,Slug,Description,CategoryId,Gender,Brand,Price,SalePrice,Images,Tags,IsFeatured,IsNewArrival) VALUES (@name,@slug,@desc,@cid,@gender,@brand,@price,@salePrice,@images,@tags,@feat,@newArr)",
      { name, slug, desc:description||"", cid:categoryId||null, gender:gender||null, brand:brand||"", price:parseFloat(price)||0, salePrice:salePrice?parseFloat(salePrice):null, images:JSON.stringify(images), tags:tags||"", feat:isFeatured?1:0, newArr:isNewArrival?1:0 }
    );
    req.flash("success", "Da them san pham!"); res.redirect("/admin/products");
  } catch (err) { console.error(err); req.flash("error", "Loi tao san pham"); res.redirect("/admin/products/new"); }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categoryId, gender, brand, price, salePrice, tags, isFeatured, isNewArrival } = req.body;
    let images = [];
    if (req.files && req.files.length > 0) images = req.files.map(f => "/uploads/" + f.filename);
    else if (req.body.imageUrls) images = req.body.imageUrls.split("\n").map(u=>u.trim()).filter(Boolean);
    else { const ex = await query("SELECT Images FROM Products WHERE Id=@id", { id }); images = (() => { try { return JSON.parse(ex.recordset[0]?.Images||"[]"); } catch { return []; } })(); }
    const slug = slugify(name, { lower: true, strict: true }) + "-" + id;
    await query("UPDATE Products SET Name=@name,Slug=@slug,Description=@desc,CategoryId=@cid,Gender=@gender,Brand=@brand,Price=@price,SalePrice=@salePrice,Images=@images,Tags=@tags,IsFeatured=@feat,IsNewArrival=@newArr WHERE Id=@id",
      { name,slug,desc:description||"",cid:categoryId||null,gender:gender||null,brand:brand||"",price:parseFloat(price)||0,salePrice:salePrice?parseFloat(salePrice):null,images:JSON.stringify(images),tags:tags||"",feat:isFeatured?1:0,newArr:isNewArrival?1:0,id });
    req.flash("success", "Da cap nhat!"); res.redirect("/admin/products");
  } catch (err) { console.error(err); req.flash("error", "Loi"); res.redirect("/admin/products"); }
};

exports.deleteProduct = async (req, res) => {
  try { await query("UPDATE Products SET IsActive=0 WHERE Id=@id", { id: req.params.id }); res.json({ success: true }); }
  catch (err) { res.json({ success: false }); }
};

exports.getOrders = async (req, res) => {
  try {
    const status = req.query.status || '';
    let sql = "SELECT o.*,(SELECT COUNT(*) FROM OrderItems WHERE OrderId=o.Id) as ItemCount FROM Orders o";
    if (status) sql += " WHERE o.OrderStatus=@status";
    sql += " ORDER BY o.CreatedAt DESC";
    const r = await query(sql, { status });
    res.render("admin/orders", { 
      title: "Đơn hàng", 
      orders: r.recordset, 
      status: status,
      total: r.recordset.length,
      totalPages: 1,
      currentPage: 1
    });
  } catch (err) { console.error("ADMIN ROUTE ERROR:", err); res.status(500).send("ERROR: " + err.message); }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await query("UPDATE Orders SET OrderStatus=@status WHERE Id=@id", { status, id: req.params.id });
    res.json({ success: true });
  } catch (err) { res.json({ success: false }); }
};

exports.getUsers = async (req, res) => {
  try {
    const filters = req.query || {};
    const r = await query("SELECT * FROM Users ORDER BY CreatedAt DESC");
    res.render("admin/users", { 
      title: "Khách hàng", 
      users: r.recordset,
      filters: filters,
      total: r.recordset.length,
      totalPages: 1,
      currentPage: 1
    });
  } catch (err) { console.error("ADMIN ROUTE ERROR:", err); res.status(500).send("ERROR: " + err.message); }
};

exports.toggleUser = async (req, res) => {
  try { await query("UPDATE Users SET IsActive=1-IsActive WHERE Id=@id", { id: req.params.id }); res.json({ success: true }); }
  catch (err) { res.json({ success: false }); }
};

exports.getCategories = async (req, res) => {
  try {
    const r = await query("SELECT * FROM Categories ORDER BY SortOrder");
    res.render("admin/categories", { title:"Danh muc", categories: r.recordset });
  } catch (err) { console.error("ADMIN ROUTE ERROR:", err); res.status(500).send("ERROR: " + err.message); }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, gender, description } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    await query("INSERT INTO Categories (Name,Slug,Gender,Description) VALUES (@name,@slug,@gender,@desc)", { name, slug, gender:gender||null, desc:description||"" });
    req.flash("success", "Da them danh muc!"); res.redirect("/admin/categories");
  } catch (err) { req.flash("error", "Loi"); res.redirect("/admin/categories"); }
};

exports.deleteCategory = async (req, res) => {
  try { await query("UPDATE Categories SET IsActive=0 WHERE Id=@id", { id: req.params.id }); res.json({ success: true }); }
  catch (err) { res.json({ success: false }); }
};

// ============ VOUCHER ============

exports.getVouchers = async (req, res) => {
  try {
    const r = await query("SELECT * FROM Vouchers ORDER BY CreatedAt DESC");
    res.render("admin/vouchers", { title: "Quản lý Voucher", vouchers: r.recordset });
  } catch (err) { console.error("ADMIN VOUCHER ERROR:", err); res.status(500).send("ERROR: " + err.message); }
};

exports.createVoucher = async (req, res) => {
  try {
    const { code, description, discountType, discountValue, minOrderValue, maxDiscount, usageLimit, startDate, endDate } = req.body;
    await query(
      `INSERT INTO Vouchers (Code, Description, DiscountType, DiscountValue, MinOrderValue, MaxDiscount, UsageLimit, StartDate, EndDate)
       VALUES (@code, @desc, @type, @value, @min, @max, @limit, @start, @end)`,
      {
        code: code.toUpperCase().trim(),
        desc: description || "",
        type: discountType || "percent",
        value: parseFloat(discountValue) || 0,
        min: parseFloat(minOrderValue) || 0,
        max: maxDiscount ? parseFloat(maxDiscount) : null,
        limit: parseInt(usageLimit) || 100,
        start: startDate || new Date(),
        end: endDate
      }
    );
    req.flash("success", "Đã tạo voucher thành công!");
    res.redirect("/admin/vouchers");
  } catch (err) {
    console.error(err);
    if (err.message && err.message.includes("UNIQUE")) {
      req.flash("error", "Mã voucher đã tồn tại!");
    } else {
      req.flash("error", "Lỗi tạo voucher");
    }
    res.redirect("/admin/vouchers");
  }
};

exports.toggleVoucher = async (req, res) => {
  try {
    await query("UPDATE Vouchers SET IsActive = 1 - IsActive WHERE Id=@id", { id: req.params.id });
    res.json({ success: true });
  } catch (err) { res.json({ success: false }); }
};

exports.deleteVoucher = async (req, res) => {
  try {
    await query("DELETE FROM Vouchers WHERE Id=@id", { id: req.params.id });
    res.json({ success: true });
  } catch (err) { res.json({ success: false }); }
};




