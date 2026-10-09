const { query } = require("../config/db");

exports.getCheckout = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect("/auth/login");
    const cR = await query("SELECT Id FROM Carts WHERE UserId=@uid", { uid: req.session.userId });
    if (!cR.recordset[0]) return res.redirect("/cart");
    const cartId = cR.recordset[0].Id;
    const iR = await query("SELECT * FROM CartItems WHERE CartId=@cid", { cid: cartId });
    if (!iR.recordset.length) return res.redirect("/cart");
    const items = iR.recordset.map(i => ({ ...i, price: parseFloat(i.Price) }));
    const subtotal = items.reduce((s,i) => s + i.price * i.Quantity, 0);
    const shippingFee = subtotal > 500000 ? 0 : 30000;
    res.render("checkout", { title: "Thanh toan", cart: { items }, subtotal, shippingFee, total: subtotal + shippingFee });
  } catch (err) { console.error(err); res.redirect("/cart"); }
};

exports.postCheckout = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect("/auth/login");
    const { fullName, phone, street, district, city, paymentMethod="cod", note } = req.body;
    const cR = await query("SELECT Id FROM Carts WHERE UserId=@uid", { uid: req.session.userId });
    if (!cR.recordset[0]) return res.redirect("/cart");
    const cartId = cR.recordset[0].Id;
    const iR = await query("SELECT * FROM CartItems WHERE CartId=@cid", { cid: cartId });
    if (!iR.recordset.length) return res.redirect("/cart");
    const items = iR.recordset.map(i => ({ ...i, price: parseFloat(i.Price) }));
    const subtotal = items.reduce((s,i) => s + i.price * i.Quantity, 0);
    const shippingFee = subtotal > 500000 ? 0 : 30000;
    const orderNumber = "FS" + Date.now().toString().slice(-8);
    const oR = await query(
      "INSERT INTO Orders (UserId,OrderNumber,FullName,Phone,Street,District,City,PaymentMethod,TotalPrice,ShippingFee,Note) OUTPUT INSERTED.Id VALUES (@uid,@on,@fn,@ph,@st,@di,@ci,@pm,@tp,@sf,@note)",
      { uid: req.session.userId, on: orderNumber, fn: fullName, ph: phone, st: street, di: district||"", ci: city, pm: paymentMethod, tp: subtotal+shippingFee, sf: shippingFee, note: note||"" }
    );
    const orderId = oR.recordset[0].Id;
    for (const item of items) {
      await query("INSERT INTO OrderItems (OrderId,ProductId,Name,Image,Price,Quantity,Color,Size) VALUES (@oid,@pid,@name,@img,@price,@qty,@color,@size)",
        { oid: orderId, pid: item.ProductId, name: item.Name, img: item.Image||"", price: item.price, qty: item.Quantity, color: item.Color||"", size: item.Size||"" });
      if (item.ProductId) await query("UPDATE Products SET Sold=Sold+@qty WHERE Id=@pid", { qty: item.Quantity, pid: item.ProductId });
    }
    await query("DELETE FROM CartItems WHERE CartId=@cid", { cid: cartId });
    res.redirect("/orders/" + orderId + "/success");
  } catch (err) { console.error(err); req.flash("error", "Loi dat hang"); res.redirect("/cart"); }
};

exports.getOrders = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect("/auth/login");
    const { status } = req.query;
    let where = "WHERE o.UserId=@uid"; const params = { uid: req.session.userId };
    if (status) { where += " AND o.OrderStatus=@status"; params.status = status; }
    const r = await query("SELECT o.*, (SELECT COUNT(*) FROM OrderItems WHERE OrderId=o.Id) as ItemCount FROM Orders o " + where + " ORDER BY o.CreatedAt DESC", params);
    
    const orders = r.recordset;
    for (let o of orders) {
      const iR = await query("SELECT TOP 1 * FROM OrderItems WHERE OrderId=@oid", { oid: o.Id });
      o.firstItem = iR.recordset[0] || null;
    }

    res.render("orders/history", { title: "Don hang cua toi", orders, currentStatus: status||"" });
  } catch (err) { res.redirect("/"); }
};

exports.getOrderDetail = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect("/auth/login");
    const { id } = req.params;
    const oR = await query("SELECT * FROM Orders WHERE Id=@id AND UserId=@uid", { id, uid: req.session.userId });
    if (!oR.recordset[0]) return res.redirect("/orders");
    const order = { ...oR.recordset[0], totalPrice: parseFloat(oR.recordset[0].TotalPrice), shippingFee: parseFloat(oR.recordset[0].ShippingFee) };
    const iR = await query("SELECT * FROM OrderItems WHERE OrderId=@id", { id });
    order.items = iR.recordset.map(i => ({ ...i, price: parseFloat(i.Price) }));
    res.render("orders/detail", { title: "Don hang #" + order.OrderNumber, order });
  } catch (err) { res.redirect("/orders"); }
};

exports.getOrderSuccess = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect("/");
    const { id } = req.params;
    const oR = await query("SELECT * FROM Orders WHERE Id=@id AND UserId=@uid", { id, uid: req.session.userId });
    if (!oR.recordset[0]) return res.redirect("/");
    const order = oR.recordset[0];
    const iR = await query("SELECT * FROM OrderItems WHERE OrderId=@id", { id });
    order.items = iR.recordset.map(i => ({ ...i, price: parseFloat(i.Price) }));
    order.totalPrice = parseFloat(order.TotalPrice);
    order.shippingFee = parseFloat(order.ShippingFee);
    res.render("orders/success", { title: "Dat hang thanh cong", order });
  } catch (err) { console.error(err); res.redirect("/"); }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const oR = await query("SELECT OrderStatus FROM Orders WHERE Id=@id AND UserId=@uid", { id, uid: req.session.userId });
    if (!oR.recordset[0] || oR.recordset[0].OrderStatus !== "pending") {
      req.flash("error", "Khong the huy don hang nay"); return res.redirect("/orders/" + id);
    }
    await query("UPDATE Orders SET OrderStatus='cancelled' WHERE Id=@id", { id });
    req.flash("success", "Da huy don hang");
    res.redirect("/orders");
  } catch (err) { res.redirect("/orders"); }
};
