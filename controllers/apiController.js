const { query } = require('../config/db');

exports.chatBot = async (req, res) => {
  try {
    const text = (req.body.message || '').toLowerCase();
    let sql = 'SELECT TOP 3 * FROM Products WHERE IsActive=1';
    let msg = 'Dạ, tôi chưa hiểu rõ ý bạn lắm. Bạn có thể nói rõ hơn bạn muốn tìm áo, quần, váy hay phụ kiện gì không ạ?';
    
    let isSearch = false;
    let where = ' AND ';
    let conditions = [];

    // Size detection
    const heightMatch = text.match(/(\d{1})[m\.](\d{1,2})/i) || text.match(/(\d{3})\s*(cm)?/i) || text.match(/m(\d{2})/i);
    const weightMatch = text.match(/(\d{2,3})\s*(kg|ky|kí|ki)/i);

    if (heightMatch || weightMatch || text.includes('size') || text.includes('kích cỡ') || text.includes('chiều cao') || text.includes('cân nặng')) {
      if (heightMatch && weightMatch) {
        let h = 0;
        if (heightMatch[0].includes('m') || heightMatch[0].includes('.')) {
          if(heightMatch[0].startsWith('m')) {
            h = 100 + parseInt(heightMatch[1]);
          } else {
            h = parseInt(heightMatch[1])*100 + parseInt(heightMatch[2].padEnd(2, '0'));
          }
        } else {
          h = parseInt(heightMatch[1]);
        }
        let w = parseInt(weightMatch[1]);
        
        let size = 'S';
        if (h > 180 || w > 78) size = 'XXL';
        else if (h >= 174 || w >= 69) size = 'XL';
        else if (h >= 168 || w >= 59) size = 'L';
        else if (h >= 160 || w >= 50) size = 'M';
        else size = 'S';
        
        return res.json({ reply: 'Dạ, với chiều cao ' + h + 'cm và cân nặng ' + w + 'kg, bạn mặc <strong>size ' + size + '</strong> là vừa vặn và tôn dáng nhất ạ! Bạn có muốn tham khảo thêm mẫu quần áo nào không?' });
      } else if (heightMatch) {
        return res.json({ reply: 'Dạ, shop đã nhận được chiều cao của bạn. Bạn vui lòng cho shop biết thêm <strong>cân nặng (kg)</strong> để shop tư vấn size chuẩn nhất nhé!' });
      } else if (weightMatch) {
        return res.json({ reply: 'Dạ, shop đã nhận được cân nặng của bạn. Bạn vui lòng cho shop biết thêm <strong>chiều cao (m)</strong> để shop tư vấn size chuẩn nhất nhé!' });
      } else {
        return res.json({ reply: 'Dạ để tư vấn size chính xác, bạn vui lòng cho shop biết <strong>chiều cao</strong> và <strong>cân nặng</strong> của bạn nhé. Ví dụ: "Mình cao 1m7 nặng 65kg".' });
      }
    }
    
    if (text.includes('khuyến mãi') || text.includes('giảm giá') || text.includes('sale')) {
      conditions.push('SalePrice IS NOT NULL AND SalePrice < Price');
      msg = 'Hiện tại shop đang có các mặt hàng giảm giá cực sốc sau đây ạ:';
      isSearch = true;
    }
    
    if (text.includes('nam')) {
      conditions.push("Gender='male'");
      if(!isSearch) msg = 'Gửi bạn một số mẫu thời trang Nam đang rất hot nhé:';
      isSearch = true;
    } else if (text.includes('nữ')) {
      conditions.push("Gender='female'");
      if(!isSearch) msg = 'Dạ, các mẫu thời trang Nữ mới nhất của shop đây ạ:';
      isSearch = true;
    }
    
    if (text.includes('áo')) {
      conditions.push("Name LIKE '%áo%'");
      msg = 'Bạn tham khảo các mẫu áo này nhé:';
      isSearch = true;
    } else if (text.includes('quần')) {
      conditions.push("Name LIKE '%quần%'");
      msg = 'Dạ quần thì shop có mấy mẫu cực xịn này ạ:';
      isSearch = true;
    } else if (text.includes('giày')) {
      conditions.push("Name LIKE '%giày%'");
      msg = 'Giày của shop thì cực kỳ êm chân luôn, bạn xem nhé:';
      isSearch = true;
    }

    if (text.includes('chào') || text.includes('hi ') || text.trim() === 'hi') {
      return res.json({ reply: 'Dạ xin chào! Bạn cần tìm mua gì ạ? Shop có đầy đủ thời trang nam nữ, áo, quần, giày dép nhé.' });
    }

    if (isSearch) {
      sql += where + conditions.join(' AND ');
      sql += ' ORDER BY CreatedAt DESC';
      const r = await query(sql);
      
      if (r.recordset.length > 0) {
        let html = msg + '<br><ul style="list-style:none; padding:0; margin-top:10px;">';
        r.recordset.forEach(p => {
          let price = new Intl.NumberFormat('vi-VN').format(p.SalePrice || p.Price) + 'đ';
          let img = '/images/product-default.jpg';
          try { img = JSON.parse(p.Images)[0]; } catch(e){}
          html += '<li style="display:flex; align-items:center; gap:10px; margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:10px;">' +
            '<img src="' + img + '" style="width:40px;height:40px;object-fit:cover;border-radius:4px;">' +
            '<div style="flex:1;">' +
              '<a href="/products/' + p.Slug + '" style="color:#d4a574;font-weight:600;font-size:0.9rem;text-decoration:none;">' + p.Name + '</a>' +
              '<div style="font-size:0.8rem;">' + price + '</div>' +
            '</div>' +
          '</li>';
        });
        html += '</ul>';
        return res.json({ reply: html });
      } else {
        return res.json({ reply: 'Rất tiếc, shop chưa tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn. Bạn thử từ khóa khác nhé!' });
      }
    }

    return res.json({ reply: msg });
  } catch (err) {
    console.error(err);
    res.json({ reply: 'Xin lỗi, hệ thống AI của tôi đang gặp chút trục trặc. Bạn vui lòng thử lại sau nhé.' });
  }
};
