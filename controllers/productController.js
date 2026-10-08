const { query } = require("../config/db");

const parseProduct = (p) => ({
  ...p, _id: p.Id, slug: p.Slug, name: p.Name,
  price: parseFloat(p.Price||0), salePrice: p.SalePrice ? parseFloat(p.SalePrice) : null,
  images: (() => { try { return JSON.parse(p.Images||"[]"); } catch { return []; } })(),
  category: { name: p.CategoryName||"", _id: p.CategoryId },
  rating: parseFloat(p.Rating||0), numReviews: p.NumReviews||0,
  discount: p.SalePrice ? Math.round((1 - p.SalePrice/p.Price)*100) : 0,
  isNewArrival: !!p.IsNewArrival, isFeatured: !!p.IsFeatured,
});

exports.getHomePage = async (req, res) => {
  try {
    const [feat, newArr, bestSellers, cats, allProds] = await Promise.all([
      query("SELECT TOP 12 p.*,c.Name as CategoryName FROM Products p LEFT JOIN Categories c ON c.Id=p.CategoryId WHERE p.IsActive=1 AND p.IsFeatured=1 ORDER BY p.CreatedAt DESC"),
      query("SELECT TOP 12 p.*,c.Name as CategoryName FROM Products p LEFT JOIN Categories c ON c.Id=p.CategoryId WHERE p.IsActive=1 AND p.IsNewArrival=1 ORDER BY p.CreatedAt DESC"),
      query("SELECT TOP 12 p.*,c.Name as CategoryName FROM Products p LEFT JOIN Categories c ON c.Id=p.CategoryId WHERE p.IsActive=1 AND p.SalePrice IS NOT NULL ORDER BY p.Sold DESC"),
      query("SELECT * FROM Categories WHERE IsActive=1 ORDER BY SortOrder"),
      query("SELECT TOP 30 p.*,c.Name as CategoryName FROM Products p LEFT JOIN Categories c ON c.Id=p.CategoryId WHERE p.IsActive=1 ORDER BY p.Sold DESC")
    ]);
    res.render("index", {
      title: "Fashion Store - Th\u1EDDi Trang Nam N\u1EEF",
      featuredProducts: feat.recordset.map(parseProduct),
      newArrivals: newArr.recordset.map(parseProduct),
      bestSellers: bestSellers.recordset.map(parseProduct),
      categories: cats.recordset,
      allProducts: allProds.recordset.map(parseProduct)
    });
  } catch (err) { console.error(err); res.render("index", { title: "Fashion Store", featuredProducts: [], newArrivals: [], bestSellers: [], categories: [], allProducts: [] }); }
};

exports.getProducts = async (req, res) => {
  try {
    let { category, gender, sort="-createdAt", minPrice, maxPrice, q, page = 1 } = req.query;
    if (minPrice === 'undefined') minPrice = '';
    if (maxPrice === 'undefined') maxPrice = '';
    if (q === 'undefined') q = '';
    if (category === 'undefined') category = '';
    if (gender === 'undefined') gender = '';

    let where = "WHERE p.IsActive=1"; const params = {};
    if (q) { 
      const words = q.split(' ').filter(w => w.trim().length > 0);
      words.forEach((w, i) => {
        where += ` AND p.Name LIKE @q${i}`;
        params[`q${i}`] = `%${w}%`;
      });
    }
    if (gender) { where += " AND p.Gender=@gender"; params.gender = gender; }
    if (minPrice) { where += " AND p.Price >= @minP"; params.minP = minPrice; }
    if (maxPrice) { where += " AND p.Price <= @maxP"; params.maxP = maxPrice; }
    if (category) { where += " AND c.Slug=@cat"; params.cat = category; }
    const orderMap = { "price-asc":"p.Price ASC", "price-desc":"p.Price DESC", "-createdAt":"p.CreatedAt DESC", "popular":"p.Sold DESC", "rating":"p.Rating DESC" };
    const orderBy = orderMap[sort] || "p.CreatedAt DESC";
    
    const countQuery = "SELECT COUNT(*) as total FROM Products p LEFT JOIN Categories c ON c.Id=p.CategoryId " + where;
    const countRes = await query(countQuery, params);
    const totalItems = countRes.recordset[0].total;
    
    const limit = 24; // 24 products per page
    const currentPage = parseInt(page) || 1;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const offset = (currentPage - 1) * limit;
    
    params.limit = limit;
    params.offset = offset;
    
    const sql = "SELECT p.*,c.Name as CategoryName FROM Products p LEFT JOIN Categories c ON c.Id=p.CategoryId " + where + " ORDER BY " + orderBy + " OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY";
    const prods = await query(sql, params);
    const cats = await query("SELECT * FROM Categories WHERE IsActive=1 ORDER BY SortOrder");
    
    const activeFilters = {};
    if (category) activeFilters.category = category;
    if (gender) activeFilters.gender = gender;
    if (sort) activeFilters.sort = sort;
    if (minPrice) activeFilters.minPrice = minPrice;
    if (maxPrice) activeFilters.maxPrice = maxPrice;
    if (q) activeFilters.q = q;

    res.render("products/list", { 
      title: "Sản phẩm", 
      products: prods.recordset.map(parseProduct), 
      categories: cats.recordset, 
      filters: activeFilters,
      currentPage,
      totalPages,
      totalItems
    });
  } catch (err) { console.error("PRODUCT ROUTE ERROR:", err); res.redirect("/"); }
};


exports.getProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const pr = await query("SELECT p.*, c.Name as CategoryName FROM Products p LEFT JOIN Categories c ON c.Id=p.CategoryId WHERE p.Slug=@slug AND p.IsActive=1", { slug });
    if (!pr.recordset[0]) return res.redirect('/products');
    const product = parseProduct(pr.recordset[0]);

    const variantsR = await query('SELECT * FROM ProductVariants WHERE ProductId=@id', { id: product.Id });
    const reviewsR = await query("SELECT r.*, u.Name as UserName, u.Avatar FROM Reviews r INNER JOIN Users u ON u.Id=r.UserId WHERE r.ProductId=@id ORDER BY r.CreatedAt DESC", { id: product.Id });
    const relatedR = await query("SELECT TOP 4 p.*, c.Name as CategoryName FROM Products p LEFT JOIN Categories c ON c.Id=p.CategoryId WHERE p.CategoryId=@cid AND p.Id!=@pid AND p.IsActive=1", { cid: product.CategoryId, pid: product.Id });

    const wishlistR = req.session.userId ? await query('SELECT 1 FROM Wishlist WHERE UserId=@uid AND ProductId=@pid', { uid: req.session.userId, pid: product.Id }) : { recordset: [] };

    let canReview = false;
    if (req.session.userId) {
      const orderCheckR = await query(`
        SELECT TOP 1 1 FROM OrderItems oi
        INNER JOIN Orders o ON o.Id = oi.OrderId
        WHERE o.UserId = @uid AND oi.ProductId = @pid AND o.OrderStatus = 'delivered'
      `, { uid: req.session.userId, pid: product.Id });
      canReview = orderCheckR.recordset.length > 0;
    }

    // Group variants
    const colors = [...new Set(variantsR.recordset.map(v => v.Color).filter(Boolean))];
    const sizes = [...new Set(variantsR.recordset.map(v => v.Size).filter(Boolean))];

    res.render('products/detail', {
      title: product.Name,
      product,
      variants: variantsR.recordset,
      colors, sizes,
      reviews: reviewsR.recordset,
      relatedProducts: relatedR.recordset.map(parseProduct),
      isWishlisted: wishlistR.recordset.length > 0,
      canReview
    });
  } catch (err) { console.error(err); res.redirect('/products'); }
};


exports.addReview = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect("/auth/login");
    const { productId, rating, comment } = req.body;
    
    // Verify purchase
    const orderCheckR = await query(`
      SELECT TOP 1 1 FROM OrderItems oi
      INNER JOIN Orders o ON o.Id = oi.OrderId
      WHERE o.UserId = @uid AND oi.ProductId = @pid AND o.OrderStatus = 'delivered'
    `, { uid: req.session.userId, pid: productId });
    
    if (orderCheckR.recordset.length === 0) {
      req.flash("error", "Bạn phải mua sản phẩm này để có thể đánh giá");
      return res.redirect("back");
    }

    await query("INSERT INTO Reviews (ProductId,UserId,Rating,Comment) VALUES (@pid,@uid,@r,@c)", { pid: productId, uid: req.session.userId, r: parseInt(rating), c: comment });
    await query("UPDATE Products SET Rating=(SELECT AVG(CAST(Rating AS DECIMAL(3,2))) FROM Reviews WHERE ProductId=@pid), NumReviews=(SELECT COUNT(*) FROM Reviews WHERE ProductId=@pid) WHERE Id=@pid", { pid: productId });
    req.flash("success", "Đã gửi đánh giá!");
    res.redirect("back");
  } catch (err) { req.flash("error", "Lỗi gửi đánh giá"); res.redirect("back"); }
};






exports.searchSuggest = async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q) return res.json([]);
    const words = q.split(' ').filter(w => w.trim().length > 0);
    let where = 'WHERE IsActive=1';
    const params = {};
    words.forEach((w, i) => {
      where += ` AND Name LIKE @q${i}`;
      params[`q${i}`] = `%${w}%`;
    });
    const sql = `SELECT TOP 5 Id, Name, Slug, Price, Images FROM Products ${where}`;
    const r = await query(sql, params);
    res.json(r.recordset);
  } catch (e) {
    res.json([]);
  }
};

