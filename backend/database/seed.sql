TRUNCATE TABLE Wishlist, Reviews, OrderItems, Orders, CartItems, Carts, ProductVariants, Products, Categories, UserAddresses, Users RESTART IDENTITY CASCADE;

-- Clear existing data

-- ============================================================
-- USERS
-- admin123 hash (bcrypt 12 rounds)
-- user123 hash
-- ============================================================
INSERT INTO Users (Name, Email, PasswordHash, Role, Phone) VALUES
('Admin Fashion', 'admin@fashionstore.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/o/GBwvCmS', 'admin', '0901000001'),
('Nguyễn Thị Lan', 'lan@gmail.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC0.SJMjXgFHVaArn7MS', 'user', '0901000002'),
('Trần Văn Minh', 'minh@gmail.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC0.SJMjXgFHVaArn7MS', 'user', '0901000003');

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO Categories (Name, Slug, Gender, SortOrder) VALUES
('Áo Nam', 'ao-nam', 'male', 1),
('Quần Nam', 'quan-nam', 'male', 2),
('Giày Nam', 'giay-nam', 'male', 3),
('Phụ Kiện Nam', 'phu-kien-nam', 'male', 4),
('Áo Nữ', 'ao-nu', 'female', 5),
('Quần Nữ', 'quan-nu', 'female', 6),
('Giày Nữ', 'giay-nu', 'female', 7),
('Phụ Kiện Nữ', 'phu-kien-nu', 'female', 8);

-- ============================================================
-- PRODUCTS
-- ============================================================
INSERT INTO Products (Name,Slug,Description,CategoryId,Gender,Brand,Price,SalePrice,Images,IsFeatured,IsNewArrival,Rating,NumReviews,Sold) VALUES
('Áo Polo Nam Classic', 'ao-polo-nam-classic', 'Áo polo nam chất liệu cotton cao cấp, form slim fit hiện đại', 1, 'male', 'Fashion Store', 450000, 360000, '["https://picsum.photos/seed/prod1a/600/800","https://picsum.photos/seed/prod1b/600/800","https://picsum.photos/seed/prod1c/600/800"]', 1, 0, 4.50, 12, 85),
('Áo Sơ Mi Nam Oxford', 'ao-so-mi-nam-oxford', 'Áo sơ mi nam vải Oxford nhập khẩu, phong cách lịch lãm', 1, 'male', 'Fashion Store', 650000, NULL, '["https://picsum.photos/seed/prod2a/600/800","https://picsum.photos/seed/prod2b/600/800"]', 1, 1, 4.20, 8, 42),
('Áo Thun Nam Oversized', 'ao-thun-nam-oversized', 'Áo thun nam form rộng thoải mái, phong cách streetwear', 1, 'male', 'Fashion Store', 280000, 220000, '["https://picsum.photos/seed/prod3a/600/800","https://picsum.photos/seed/prod3b/600/800"]', 0, 1, 4.00, 15, 120),
('Quần Jeans Nam Slim', 'quan-jeans-nam-slim', 'Quần jeans nam form slim fit, co giãn tốt, bền đẹp', 2, 'male', 'Fashion Store', 750000, 600000, '["https://picsum.photos/seed/prod4a/600/800","https://picsum.photos/seed/prod4b/600/800"]', 1, 0, 4.70, 20, 95),
('Quần Kaki Nam', 'quan-kaki-nam', 'Quần kaki nam lịch sự, phù hợp đi làm và đi chơi', 2, 'male', 'Fashion Store', 520000, NULL, '["https://picsum.photos/seed/prod5a/600/800","https://picsum.photos/seed/prod5b/600/800"]', 0, 1, 4.10, 6, 38),
('Giày Sneaker Nam', 'giay-sneaker-nam', 'Giày sneaker nam thể thao năng động, đế êm ái', 3, 'male', 'Fashion Store', 1200000, 990000, '["https://picsum.photos/seed/prod6a/600/800","https://picsum.photos/seed/prod6b/600/800"]', 1, 1, 4.80, 25, 60),
('Dây Lưng Da Nam', 'day-lung-da-nam', 'Dây lưng da thật cao cấp, khóa kim loại mạ vàng', 4, 'male', 'Fashion Store', 350000, NULL, '["https://picsum.photos/seed/prod7a/600/800","https://picsum.photos/seed/prod7b/600/800"]', 0, 0, 4.30, 9, 45),
('Đồng Hồ Nam Thể Thao', 'dong-ho-nam-the-thao', 'Đồng hồ nam thể thao, chống nước 50m, pin năng lượng mặt trời', 4, 'male', 'Fashion Store', 1800000, 1500000, '["https://picsum.photos/seed/prod8a/600/800","https://picsum.photos/seed/prod8b/600/800"]', 1, 0, 4.60, 18, 30),
('Áo Blouse Nữ Trắng', 'ao-blouse-nu-trang', 'Áo blouse nữ màu trắng thanh lịch, phù hợp đi làm', 5, 'female', 'Fashion Store', 480000, 380000, '["https://picsum.photos/seed/prod9a/600/800","https://picsum.photos/seed/prod9b/600/800"]', 1, 1, 4.50, 22, 88),
('Áo Crop Top Nữ', 'ao-crop-top-nu', 'Áo crop top nữ năng động, phù hợp mùa hè', 5, 'female', 'Fashion Store', 220000, 180000, '["https://picsum.photos/seed/prod10a/600/800","https://picsum.photos/seed/prod10b/600/800"]', 0, 1, 3.90, 14, 105),
('Váy Midi Floral', 'vay-midi-floral', 'Váy midi họa tiết hoa nhẹ nhàng, duyên dáng', 6, 'female', 'Fashion Store', 680000, 550000, '["https://picsum.photos/seed/prod11a/600/800","https://picsum.photos/seed/prod11b/600/800"]', 1, 1, 4.70, 30, 72),
('Quần Tây Nữ Công Sở', 'quan-tay-nu-cong-so', 'Quần tây nữ công sở sang trọng, form chuẩn', 6, 'female', 'Fashion Store', 590000, NULL, '["https://picsum.photos/seed/prod12a/600/800","https://picsum.photos/seed/prod12b/600/800"]', 0, 0, 4.20, 11, 55),
('Giày Cao Gót Nữ', 'giay-cao-got-nu', 'Giày cao gót nữ 7cm thanh lịch, phù hợp đi làm và dự tiệc', 7, 'female', 'Fashion Store', 950000, 790000, '["https://picsum.photos/seed/prod13a/600/800","https://picsum.photos/seed/prod13b/600/800"]', 1, 0, 4.40, 19, 48),
('Giày Sandal Nữ', 'giay-sandal-nu', 'Giày sandal nữ mùa hè thoáng mát, quai da mềm', 7, 'female', 'Fashion Store', 420000, 350000, '["https://picsum.photos/seed/prod14a/600/800","https://picsum.photos/seed/prod14b/600/800"]', 0, 1, 4.00, 7, 63),
('Túi Xách Nữ Da PU', 'tui-xach-nu-da-pu', 'Túi xách nữ da PU cao cấp, thiết kế hiện đại', 8, 'female', 'Fashion Store', 780000, 650000, '["https://picsum.photos/seed/prod15a/600/800","https://picsum.photos/seed/prod15b/600/800"]', 1, 1, 4.60, 35, 80),
('Vòng Cổ Nữ Bạc', 'vong-co-nu-bac', 'Vòng cổ bạc 925 mặt đá CZ lấp lánh', 8, 'female', 'Fashion Store', 450000, NULL, '["https://picsum.photos/seed/prod16a/600/800","https://picsum.photos/seed/prod16b/600/800"]', 0, 1, 4.80, 28, 95),
('Áo Khoác Bomber Nam', 'ao-khoac-bomber-nam', 'Áo khoác bomber nam phong cách, chất liệu dù cao cấp', 1, 'male', 'Fashion Store', 1100000, 880000, '["https://picsum.photos/seed/prod17a/600/800","https://picsum.photos/seed/prod17b/600/800"]', 1, 1, 4.50, 16, 40),
('Đầm Maxi Nữ', 'dam-maxi-nu', 'Đầm maxi nữ dài thoáng mát, họa tiết nhiệt đới', 5, 'female', 'Fashion Store', 850000, 720000, '["https://picsum.photos/seed/prod18a/600/800","https://picsum.photos/seed/prod18b/600/800"]', 1, 1, 4.30, 21, 55);

-- ============================================================
-- PRODUCT VARIANTS
-- ============================================================
-- Áo Polo Nam (Id=1)
INSERT INTO ProductVariants (ProductId,Color,Size,Stock) VALUES
(1,'Trắng','S',20),(1,'Trắng','M',30),(1,'Trắng','L',25),(1,'Trắng','XL',15),
(1,'Đen','S',18),(1,'Đen','M',28),(1,'Đen','L',20),(1,'Đen','XL',10),
(1,'Be','S',15),(1,'Be','M',22),(1,'Be','L',18);

-- Áo Sơ Mi Oxford (Id=2)
INSERT INTO ProductVariants (ProductId,Color,Size,Stock) VALUES
(2,'Trắng','S',15),(2,'Trắng','M',25),(2,'Trắng','L',20),(2,'Trắng','XL',10),
(2,'Xanh','S',12),(2,'Xanh','M',20),(2,'Xanh','L',15);

-- Áo Thun Oversized (Id=3)
INSERT INTO ProductVariants (ProductId,Color,Size,Stock) VALUES
(3,'Đen','S',30),(3,'Đen','M',40),(3,'Đen','L',35),(3,'Đen','XL',20),
(3,'Trắng','S',25),(3,'Trắng','M',35),(3,'Trắng','L',30);

-- Quần Jeans (Id=4)
INSERT INTO ProductVariants (ProductId,Color,Size,Stock) VALUES
(4,'Xanh đậm','28',20),(4,'Xanh đậm','30',30),(4,'Xanh đậm','32',25),(4,'Xanh đậm','34',15),
(4,'Xanh nhạt','28',18),(4,'Xanh nhạt','30',25),(4,'Xanh nhạt','32',20);

-- Quần Kaki (Id=5)
INSERT INTO ProductVariants (ProductId,Color,Size,Stock) VALUES
(5,'Be','28',15),(5,'Be','30',20),(5,'Be','32',18),(5,'Be','34',10),
(5,'Đen','28',12),(5,'Đen','30',18),(5,'Đen','32',15);

-- Giày Sneaker (Id=6)
INSERT INTO ProductVariants (ProductId,Color,Size,Stock) VALUES
(6,'Trắng','39',10),(6,'Trắng','40',15),(6,'Trắng','41',20),(6,'Trắng','42',12),(6,'Trắng','43',8),
(6,'Đen','39',8),(6,'Đen','40',12),(6,'Đen','41',18),(6,'Đen','42',10);

-- Products 7-18 variants (simplified)
INSERT INTO ProductVariants (ProductId,Color,Size,Stock) VALUES
(7,'Nâu','M',30),(7,'Đen','M',25),
(8,'Đen','M',15),(8,'Bạc','M',12),
(9,'Trắng','S',25),(9,'Trắng','M',30),(9,'Trắng','L',20),(9,'Xanh','S',20),(9,'Xanh','M',25),
(10,'Trắng','XS',40),(10,'Trắng','S',35),(10,'Đen','XS',30),(10,'Đen','S',25),
(11,'Đa sắc','S',20),(11,'Đa sắc','M',30),(11,'Đa sắc','L',25),
(12,'Đen','S',15),(12,'Đen','M',20),(12,'Đen','L',18),(12,'Be','S',12),(12,'Be','M',15),
(13,'Đen','35',12),(13,'Đen','36',15),(13,'Đen','37',18),(13,'Đen','38',10),(13,'Nude','36',12),(13,'Nude','37',15),
(14,'Be','35',20),(14,'Be','36',25),(14,'Be','37',22),(14,'Trắng','36',18),(14,'Trắng','37',20),
(15,'Đen','S',25),(15,'Đen','M',20),(15,'Nâu','S',18),(15,'Nâu','M',15),
(16,'Bạc','M',50),
(17,'Đen','S',15),(17,'Đen','M',20),(17,'Đen','L',18),(17,'Xanh rêu','M',12),(17,'Xanh rêu','L',10),
(18,'Vàng','S',15),(18,'Vàng','M',20),(18,'Hồng','S',18),(18,'Hồng','M',22);

