const { query } = require("../config/db");

const getOrCreateCart = async (userId) => {
  let r = await query("SELECT Id FROM Carts WHERE UserId=@uid", { uid: userId });
  if (!r.recordset[0]) {
    await query("INSERT INTO Carts (UserId) VALUES (@uid)", { uid: userId });
    r = await query("SELECT Id FROM Carts WHERE UserId=@uid", { uid: userId });
  }
  return r.recordset[0].Id;
};

exports.getCart = async (req, res) => {
  try {
    const cR = await query("SELECT Id FROM Carts WHERE UserId=@uid", { uid: req.session.userId });
    let items = [], totalPrice = 0;
    if (cR.recordset[0]) {
      const iR = await query("SELECT * FROM CartItems WHERE CartId=@cid", { cid: cR.recordset[0].Id });
      items = iR.recordset.map(i => ({ ...i, _id: i.Id, price: parseFloat(i.Price) }));
      totalPrice = items.reduce((s,i) => s + i.price * i.Quantity, 0);
    }
    res.render("cart", { title: "Gio hang", items, totalPrice, shippingFee: totalPrice > 500000 ? 0 : 30000 });
  } catch (err) { console.error(err); res.render("cart", { title: "Gio hang", items: [], totalPrice: 0, shippingFee: 30000 }); }
};

exports.addToCart = async (req, res) => {
  try {
    if (!req.session.userId) return res.json({ success: false, redirect: "/auth/login" });
    const { productId, quantity=1, color="", size="" } = req.body;
    const pR = await query("SELECT Id,Name,Images,Price,SalePrice FROM Products WHERE Id=@id AND IsActive=1", { id: productId });
    const p = pR.recordset[0];
    if (!p) return res.json({ success: false, message: "Khong tim thay san pham" });
    const cartId = await getOrCreateCart(req.session.userId);
    const price = parseFloat(p.SalePrice || p.Price);
    const imgs = (() => { try { return JSON.parse(p.Images||"[]"); } catch { return []; } })();
    const ex = await query("SELECT Id,Quantity FROM CartItems WHERE CartId=@cid AND ProductId=@pid AND Color=@color AND Size=@size", { cid:cartId, pid:productId, color, size });
    if (ex.recordset[0]) {
      await query("UPDATE CartItems SET Quantity=Quantity+@qty WHERE Id=@id", { qty: parseInt(quantity), id: ex.recordset[0].Id });
    } else {
      await query("INSERT INTO CartItems (CartId,ProductId,Name,Image,Price,Color,Size,Quantity) VALUES (@cid,@pid,@name,@img,@price,@color,@size,@qty)",
        { cid:cartId, pid:productId, name:p.Name, img:imgs[0]||"/images/product-default.jpg", price, color, size, qty:parseInt(quantity) });
    }
    await query("UPDATE Carts SET UpdatedAt=GETDATE() WHERE Id=@cid", { cid:cartId });
    const cntR = await query("SELECT ISNULL(SUM(Quantity),0) as cnt FROM CartItems WHERE CartId=@cid", { cid:cartId });
    res.json({ success: true, cartCount: cntR.recordset[0]?.cnt||0, message: "Da them vao gio hang!" });
  } catch (err) { console.error(err); res.json({ success: false, message: "Loi" }); }
};

exports.updateCart = async (req, res) => {
  try {
    if (!req.session.userId) return res.json({ success: false, redirect: "/auth/login" });
    const { itemId, quantity } = req.body;
    if (parseInt(quantity) <= 0) { await query("DELETE FROM CartItems WHERE Id=@id", { id: itemId }); }
    else { await query("UPDATE CartItems SET Quantity=@qty WHERE Id=@id", { qty: parseInt(quantity), id: itemId }); }
    const cR = await query("SELECT ISNULL(SUM(ci.Quantity),0) as cnt, ISNULL(SUM(ci.Price*ci.Quantity),0) as total FROM Carts c LEFT JOIN CartItems ci ON ci.CartId=c.Id WHERE c.UserId=@uid GROUP BY c.Id", { uid: req.session.userId });
    const row = cR.recordset[0] || {};
    res.json({ success: true, cartCount: row.cnt||0, totalPrice: row.total||0 });
  } catch (err) { res.json({ success: false }); }
};

exports.removeFromCart = async (req, res) => {
  try {
    if (!req.session.userId) return res.json({ success: false, redirect: "/auth/login" });
    const { itemId } = req.body;
    await query("DELETE FROM CartItems WHERE Id=@id", { id: itemId });
    res.json({ success: true });
  } catch (err) { res.json({ success: false }); }
};
