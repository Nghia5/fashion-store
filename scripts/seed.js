require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/database');

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const seed = async () => {
  await connectDB();
  console.log('🌱 Bắt đầu seed dữ liệu...');

  // Clear existing data
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});
  console.log('🗑️  Đã xóa dữ liệu cũ');

  // Create Admin User
  const users = await User.create([
    { name: 'Admin Fashion Store', email: 'admin@fashionstore.vn', password: 'admin123', role: 'admin', phone: '0901234567' },
    { name: 'Nguyễn Thị Lan', email: 'lan@gmail.com', password: 'user123', role: 'user', phone: '0912345678' },
    { name: 'Trần Văn Nam', email: 'nam@gmail.com', password: 'user123', role: 'user', phone: '0923456789' }
  ]);
  console.log('✅ Đã tạo 3 người dùng (1 admin, 2 user)');

  // Create Categories
  const categories = await Category.insertMany([
    { name: 'Áo Thun', slug: 'ao-thun', gender: 'unisex', sortOrder: 1 },
    { name: 'Áo Sơ Mi', slug: 'ao-so-mi', gender: 'male', sortOrder: 2 },
    { name: 'Quần Jeans', slug: 'quan-jeans', gender: 'unisex', sortOrder: 3 },
    { name: 'Váy Đầm', slug: 'vay-dam', gender: 'female', sortOrder: 4 },
    { name: 'Áo Khoác', slug: 'ao-khoac', gender: 'unisex', sortOrder: 5 },
    { name: 'Quần Short', slug: 'quan-short', gender: 'male', sortOrder: 6 },
    { name: 'Chân Váy', slug: 'chan-vay', gender: 'female', sortOrder: 7 },
    { name: 'Phụ Kiện', slug: 'phu-kien', gender: 'unisex', sortOrder: 8 }
  ]);
  console.log('✅ Đã tạo', categories.length, 'danh mục');

  const [aoThun, aoSoMi, quanJeans, vayDam, aoKhoac, quanShort, chanVay, phuKien] = categories;

  const placeholderImages = {
    male: [
      'https://picsum.photos/seed/m1/600/800',
      'https://picsum.photos/seed/m2/600/800',
      'https://picsum.photos/seed/m3/600/800',
      'https://picsum.photos/seed/m4/600/800',
      'https://picsum.photos/seed/m5/600/800',
      'https://picsum.photos/seed/m6/600/800'
    ],
    female: [
      'https://picsum.photos/seed/f1/600/800',
      'https://picsum.photos/seed/f2/600/800',
      'https://picsum.photos/seed/f3/600/800',
      'https://picsum.photos/seed/f4/600/800',
      'https://picsum.photos/seed/f5/600/800',
      'https://picsum.photos/seed/f6/600/800'
    ],
    unisex: [
      'https://picsum.photos/seed/u1/600/800',
      'https://picsum.photos/seed/u2/600/800',
      'https://picsum.photos/seed/u3/600/800',
      'https://picsum.photos/seed/u4/600/800',
      'https://picsum.photos/seed/u5/600/800'
    ]
  };

  const getVariants = (colors, sizes) => {
    const variants = [];
    colors.forEach(color => sizes.forEach(size => variants.push({ color, size, stock: Math.floor(Math.random()*50)+10 })));
    return variants;
  };

  const products = [
    // Áo Thun Nam
    { name: 'Áo Thun Basic Cotton Oversize', category: aoThun._id, gender: 'male', price: 299000, salePrice: 199000, description: 'Áo thun cotton 100% cao cấp, kiểu dáng oversize phong cách. Chất liệu mềm mại, thoáng mát, phù hợp mặc đi chơi, đi làm casual.', images: [placeholderImages.male[0], placeholderImages.male[1]], variants: getVariants(['Đen','Trắng','Xám'], ['S','M','L','XL']), tags: ['cotton','oversize','basic'], isFeatured: true, isNewArrival: true, sold: 234, rating: 4.8, numReviews: 89 },
    { name: 'Áo Thun Polo Nam Stripe Classic', category: aoThun._id, gender: 'male', price: 450000, salePrice: 320000, description: 'Áo polo sọc ngang phong cách preppy. Chất liệu pique cotton cao cấp, cổ bẻ thanh lịch. Phù hợp đi làm business casual.', images: [placeholderImages.male[1], placeholderImages.male[2]], variants: getVariants(['Navy','White','Red'], ['S','M','L','XL','XXL']), tags: ['polo','stripe','classic'], isFeatured: true, sold: 156, rating: 4.6, numReviews: 63 },
    { name: 'Áo Sơ Mi Nam Oxford Slim Fit', category: aoSoMi._id, gender: 'male', price: 599000, salePrice: 420000, description: 'Áo sơ mi oxford vải cao cấp, form slim fit tôn dáng. Thiết kế thanh lịch, phù hợp đi làm và sự kiện.', images: [placeholderImages.male[2]], variants: getVariants(['Xanh','Trắng','Hồng nhạt'], ['S','M','L','XL']), tags: ['somi','oxford','slim'], isFeatured: true, sold: 98, rating: 4.7, numReviews: 42 },
    { name: 'Áo Thun Graphic Tee Premium', category: aoThun._id, gender: 'male', price: 380000, description: 'Áo thun in hình graphic art độc đáo. Vải premium cotton 220g, dày dặn, không xù lông.', images: [placeholderImages.male[3]], variants: getVariants(['Đen','Trắng'], ['S','M','L','XL']), tags: ['graphic','art','premium'], sold: 67, rating: 4.5, numReviews: 28 },
    { name: 'Áo Khoác Bomber Jacket Nam', category: aoKhoac._id, gender: 'male', price: 1290000, salePrice: 890000, description: 'Áo khoác bomber phong cách streetwear. Chất liệu nylon cao cấp, lót lông ấm áp. Must-have cho mùa thu đông.', images: [placeholderImages.male[4]], variants: getVariants(['Đen','Olive','Navy'], ['M','L','XL','XXL']), tags: ['bomber','jacket','streetwear'], isFeatured: true, isNewArrival: true, sold: 145, rating: 4.9, numReviews: 56 },
    { name: 'Quần Jeans Nam Slim Wash', category: quanJeans._id, gender: 'male', price: 799000, salePrice: 550000, description: 'Quần jeans slim fit wash nhẹ, form dáng chuẩn. Vải denim co giãn 4 chiều, thoải mái vận động.', images: [placeholderImages.male[5]], variants: getVariants(['Indigo','Xanh đậm','Đen'], ['28','29','30','31','32','34']), tags: ['jeans','slim','denim'], sold: 189, rating: 4.7, numReviews: 74 },
    { name: 'Quần Short Nam Chino', category: quanShort._id, gender: 'male', price: 420000, salePrice: 299000, description: 'Quần short chino nam phong cách, vải kaki cao cấp. Thiết kế nhiều túi tiện dụng.', images: [placeholderImages.male[0]], variants: getVariants(['Beige','Navy','Xanh'], ['S','M','L','XL']), tags: ['chino','short','kaki'], isNewArrival: true, sold: 112, rating: 4.5, numReviews: 38 },

    // Nữ
    { name: 'Váy Maxi Floral Boho', category: vayDam._id, gender: 'female', price: 799000, salePrice: 550000, description: 'Váy maxi hoa nhí phong cách boho, nhẹ nhàng và nữ tính. Chất liệu voan mềm mại, thoáng mát.', images: [placeholderImages.female[0], placeholderImages.female[1]], variants: getVariants(['Hoa hồng','Hoa xanh','Hoa tím'], ['XS','S','M','L']), tags: ['maxi','floral','boho'], isFeatured: true, isNewArrival: true, sold: 267, rating: 4.9, numReviews: 103 },
    { name: 'Áo Thun Nữ Crop Top Basic', category: aoThun._id, gender: 'female', price: 259000, salePrice: 180000, description: 'Áo crop top basic siêu cute, tôn dáng tối đa. Vải cotton mềm, nhiều màu pastel.', images: [placeholderImages.female[1]], variants: getVariants(['Trắng','Hồng','Lavender','Mint'], ['XS','S','M','L']), tags: ['croptop','basic','pastel'], isFeatured: true, sold: 345, rating: 4.8, numReviews: 127 },
    { name: 'Đầm Wrap Dress Elegant', category: vayDam._id, gender: 'female', price: 950000, salePrice: 680000, description: 'Đầm wrap dress quấn thân thanh lịch, phù hợp đi làm và dự tiệc. Vải crepe cao cấp, chống nhăn.', images: [placeholderImages.female[2], placeholderImages.female[3]], variants: getVariants(['Đỏ mận','Đen','Caramel'], ['XS','S','M','L','XL']), tags: ['wrap','dress','elegant'], isFeatured: true, sold: 189, rating: 4.9, numReviews: 78 },
    { name: 'Chân Váy Midi A-Line', category: chanVay._id, gender: 'female', price: 620000, salePrice: 430000, description: 'Chân váy midi form A-line cổ điển, thanh lịch. Phối đẹp với nhiều kiểu áo khác nhau.', images: [placeholderImages.female[3]], variants: getVariants(['Đen','Trắng','Caramel','Hồng'], ['XS','S','M','L']), tags: ['midi','aline','classic'], sold: 134, rating: 4.7, numReviews: 51 },
    { name: 'Áo Khoác Nữ Blazer Oversize', category: aoKhoac._id, gender: 'female', price: 1190000, salePrice: 820000, description: 'Blazer oversize nữ phong cách office chic. Chất liệu tweed cao cấp, lót lụa mềm mại.', images: [placeholderImages.female[4]], variants: getVariants(['Đen','Kem','Xám','Caramel'], ['XS','S','M','L']), tags: ['blazer','oversize','office'], isFeatured: true, isNewArrival: true, sold: 98, rating: 4.8, numReviews: 39 },
    { name: 'Quần Jeans Nữ Wide Leg', category: quanJeans._id, gender: 'female', price: 750000, salePrice: 520000, description: 'Quần jeans wide leg trendy, phong cách Y2K. Cạp cao tôn dáng, ống rộng thoải mái.', images: [placeholderImages.female[5]], variants: getVariants(['Xanh nhạt','Xanh đậm','Trắng'], ['25','26','27','28','29','30']), tags: ['jeans','wideleg','y2k'], isNewArrival: true, sold: 223, rating: 4.8, numReviews: 89 },
    { name: 'Đầm Bodycon Mini Đêm', category: vayDam._id, gender: 'female', price: 650000, salePrice: 450000, description: 'Đầm bodycon mini gợi cảm, hoàn hảo cho đêm tiệc. Vải co giãn 4 chiều ôm sát tôn dáng.', images: [placeholderImages.female[0]], variants: getVariants(['Đen','Đỏ','Bạc'], ['XS','S','M']), tags: ['bodycon','mini','party'], sold: 167, rating: 4.6, numReviews: 65 },

    // Unisex / Accessories
    { name: 'Mũ Bucket Hat Canvas', category: phuKien._id, gender: 'unisex', price: 280000, salePrice: 199000, description: 'Mũ bucket hat canvas phong cách retro. Chất liệu canvas bền đẹp, form vừa phù hợp mọi đầu.', images: [placeholderImages.unisex[0]], variants: [{ color: 'Đen', size: 'One Size', stock: 50 }, { color: 'Trắng', size: 'One Size', stock: 40 }], tags: ['bucket','hat','retro'], sold: 145, rating: 4.6, numReviews: 58 },
    { name: 'Tote Bag Canvas Premium', category: phuKien._id, gender: 'unisex', price: 350000, description: 'Túi tote canvas premium, đẹp và tiện dụng. In họa tiết độc đáo, dây đeo chắc chắn.', images: [placeholderImages.unisex[1]], variants: [{ color: 'Trắng kem', size: 'One Size', stock: 80 }, { color: 'Đen', size: 'One Size', stock: 60 }], tags: ['totebag','canvas','eco'], isFeatured: true, sold: 189, rating: 4.7, numReviews: 72 },
    { name: 'Áo Hoodie Unisex Cozy', category: aoKhoac._id, gender: 'unisex', price: 850000, salePrice: 599000, description: 'Hoodie unisex siêu ấm và thoải mái. Chất liệu french terry 380g, túi kangaro tiện dụng.', images: [placeholderImages.unisex[2], placeholderImages.unisex[3]], variants: getVariants(['Đen','Trắng','Xám','Caramel'], ['S','M','L','XL','XXL']), tags: ['hoodie','unisex','cozy'], isFeatured: true, isNewArrival: true, sold: 289, rating: 4.9, numReviews: 115 },
    { name: 'Sneaker Canvas All-White', category: phuKien._id, gender: 'unisex', price: 650000, salePrice: 450000, description: 'Giày sneaker canvas trắng đơn giản mà đẳng cấp. Đế cao su bền bỉ, phù hợp mọi outfit.', images: [placeholderImages.unisex[4]], variants: getVariants(['Trắng'], ['36','37','38','39','40','41','42','43']), tags: ['sneaker','canvas','white'], sold: 312, rating: 4.8, numReviews: 134 },
  ];

  // Set slug manually to avoid hook issues with insertMany
  const slugify = require('slugify');
  const productsWithSlug = products.map(p => ({
    ...p,
    slug: slugify(p.name, { lower: true, locale: 'vi' }) + '-' + Date.now() + Math.random().toString(36).substr(2,5)
  }));

  await Product.insertMany(productsWithSlug);
  console.log('✅ Đã tạo', products.length, 'sản phẩm');

  console.log('\n🎉 Seed dữ liệu hoàn tất!');
  console.log('='.repeat(50));
  console.log('📧 Admin: admin@fashionstore.vn | 🔑 Password: admin123');
  console.log('📧 User:  lan@gmail.com        | 🔑 Password: user123');
  console.log('🌐 Website: http://localhost:3000');
  console.log('🔧 Admin Panel: http://localhost:3000/admin');
  console.log('='.repeat(50));

  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Lỗi seed:', err);
  process.exit(1);
});
