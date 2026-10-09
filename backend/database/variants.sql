USE FashionStoreDB;
DECLARE @base INT = (SELECT MIN(Id) FROM Products);

-- Products 1-9 (Id = @base to @base+8)
INSERT INTO ProductVariants (ProductId,Color,Size,Stock) VALUES
-- Polo Nam
(@base+0,'Trang','S',20),(@base+0,'Trang','M',30),(@base+0,'Trang','L',25),(@base+0,'Trang','XL',15),
(@base+0,'Den','S',18),(@base+0,'Den','M',28),(@base+0,'Den','L',20),
-- So Mi Oxford
(@base+1,'Trang','S',15),(@base+1,'Trang','M',25),(@base+1,'Trang','L',20),
(@base+1,'Xanh','S',12),(@base+1,'Xanh','M',20),(@base+1,'Xanh','L',15),
-- Thun Oversized
(@base+2,'Den','S',30),(@base+2,'Den','M',40),(@base+2,'Den','L',35),(@base+2,'Den','XL',20),
(@base+2,'Trang','S',25),(@base+2,'Trang','M',35),(@base+2,'Trang','L',30),
-- Jeans
(@base+3,'Xanh dam','28',20),(@base+3,'Xanh dam','30',30),(@base+3,'Xanh dam','32',25),(@base+3,'Xanh dam','34',15),
(@base+3,'Xanh nhat','30',25),(@base+3,'Xanh nhat','32',20),
-- Kaki
(@base+4,'Be','28',15),(@base+4,'Be','30',20),(@base+4,'Be','32',18),
(@base+4,'Den','30',18),(@base+4,'Den','32',15),
-- Sneaker
(@base+5,'Trang','39',10),(@base+5,'Trang','40',15),(@base+5,'Trang','41',20),(@base+5,'Trang','42',12),
(@base+5,'Den','40',12),(@base+5,'Den','41',18),(@base+5,'Den','42',10),
-- Day lung
(@base+6,'Nau','M',30),(@base+6,'Den','M',25),
-- Dong ho
(@base+7,'Den','M',15),(@base+7,'Bac','M',12),
-- Blouse Nu
(@base+8,'Trang','S',25),(@base+8,'Trang','M',30),(@base+8,'Trang','L',20),
(@base+8,'Xanh','S',20),(@base+8,'Xanh','M',25),
-- Crop Top
(@base+9,'Trang','XS',40),(@base+9,'Trang','S',35),(@base+9,'Den','XS',30),(@base+9,'Den','S',25),
-- Vay Midi
(@base+10,'Da sac','S',20),(@base+10,'Da sac','M',30),(@base+10,'Da sac','L',25),
-- Quan Tay
(@base+11,'Den','S',15),(@base+11,'Den','M',20),(@base+11,'Den','L',18),(@base+11,'Be','S',12),(@base+11,'Be','M',15),
-- Giay Cao Got
(@base+12,'Den','35',12),(@base+12,'Den','36',15),(@base+12,'Den','37',18),(@base+12,'Den','38',10),
(@base+12,'Nude','36',12),(@base+12,'Nude','37',15),
-- Sandal
(@base+13,'Be','35',20),(@base+13,'Be','36',25),(@base+13,'Be','37',22),
(@base+13,'Trang','36',18),(@base+13,'Trang','37',20),
-- Tui Xach
(@base+14,'Den','M',25),(@base+14,'Den','L',20),(@base+14,'Nau','M',18),
-- Vong Co
(@base+15,'Bac','M',50),
-- Bomber
(@base+16,'Den','S',15),(@base+16,'Den','M',20),(@base+16,'Den','L',18),
(@base+16,'Xanh reu','M',12),(@base+16,'Xanh reu','L',10),
-- Dam Maxi
(@base+17,'Vang','S',15),(@base+17,'Vang','M',20),(@base+17,'Hong','S',18),(@base+17,'Hong','M',22);

PRINT 'Variants inserted OK';
