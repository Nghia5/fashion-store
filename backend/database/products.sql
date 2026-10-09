USE FashionStoreDB;

INSERT INTO Products (Name,Slug,Description,CategoryId,Gender,Brand,Price,SalePrice,Images,IsFeatured,IsNewArrival,Rating,NumReviews,Sold) VALUES
(N'Ao Polo Nam Classic','ao-polo-nam-classic',N'Ao polo nam chat lieu cotton cao cap',0,'male','Fashion Store',450000,360000,'["https://picsum.photos/seed/prod1a/600/800","https://picsum.photos/seed/prod1b/600/800","https://picsum.photos/seed/prod1c/600/800"]',1,0,4.50,12,85),
(N'Ao So Mi Nam Oxford','ao-so-mi-nam-oxford',N'Ao so mi nam vai Oxford nhap khau',0,'male','Fashion Store',650000,NULL,'["https://picsum.photos/seed/prod2a/600/800","https://picsum.photos/seed/prod2b/600/800"]',1,1,4.20,8,42),
(N'Ao Thun Nam Oversized','ao-thun-nam-oversized',N'Ao thun nam form rong thoai mai',0,'male','Fashion Store',280000,220000,'["https://picsum.photos/seed/prod3a/600/800","https://picsum.photos/seed/prod3b/600/800"]',0,1,4.00,15,120),
(N'Quan Jeans Nam Slim','quan-jeans-nam-slim',N'Quan jeans nam form slim fit',1,'male','Fashion Store',750000,600000,'["https://picsum.photos/seed/prod4a/600/800","https://picsum.photos/seed/prod4b/600/800"]',1,0,4.70,20,95),
(N'Quan Kaki Nam','quan-kaki-nam',N'Quan kaki nam lich su di lam di choi',1,'male','Fashion Store',520000,NULL,'["https://picsum.photos/seed/prod5a/600/800","https://picsum.photos/seed/prod5b/600/800"]',0,1,4.10,6,38),
(N'Giay Sneaker Nam','giay-sneaker-nam',N'Giay sneaker nam the thao nang dong',2,'male','Fashion Store',1200000,990000,'["https://picsum.photos/seed/prod6a/600/800","https://picsum.photos/seed/prod6b/600/800"]',1,1,4.80,25,60),
(N'Day Lung Da Nam','day-lung-da-nam',N'Day lung da that cao cap khoa kim loai',3,'male','Fashion Store',350000,NULL,'["https://picsum.photos/seed/prod7a/600/800","https://picsum.photos/seed/prod7b/600/800"]',0,0,4.30,9,45),
(N'Dong Ho Nam The Thao','dong-ho-nam-the-thao',N'Dong ho nam the thao chong nuoc 50m',3,'male','Fashion Store',1800000,1500000,'["https://picsum.photos/seed/prod8a/600/800","https://picsum.photos/seed/prod8b/600/800"]',1,0,4.60,18,30),
(N'Ao Blouse Nu Trang','ao-blouse-nu-trang',N'Ao blouse nu mau trang thanh lich',4,'female','Fashion Store',480000,380000,'["https://picsum.photos/seed/prod9a/600/800","https://picsum.photos/seed/prod9b/600/800"]',1,1,4.50,22,88),
(N'Ao Crop Top Nu','ao-crop-top-nu',N'Ao crop top nu nang dong mua he',4,'female','Fashion Store',220000,180000,'["https://picsum.photos/seed/prod10a/600/800","https://picsum.photos/seed/prod10b/600/800"]',0,1,3.90,14,105),
(N'Vay Midi Floral','vay-midi-floral',N'Vay midi hoa tiet hoa nhe nhang',5,'female','Fashion Store',680000,550000,'["https://picsum.photos/seed/prod11a/600/800","https://picsum.photos/seed/prod11b/600/800"]',1,1,4.70,30,72),
(N'Quan Tay Nu Cong So','quan-tay-nu-cong-so',N'Quan tay nu cong so sang trong',5,'female','Fashion Store',590000,NULL,'["https://picsum.photos/seed/prod12a/600/800","https://picsum.photos/seed/prod12b/600/800"]',0,0,4.20,11,55),
(N'Giay Cao Got Nu','giay-cao-got-nu',N'Giay cao got nu 7cm thanh lich',6,'female','Fashion Store',950000,790000,'["https://picsum.photos/seed/prod13a/600/800","https://picsum.photos/seed/prod13b/600/800"]',1,0,4.40,19,48),
(N'Giay Sandal Nu','giay-sandal-nu',N'Giay sandal nu mua he thoang mat',6,'female','Fashion Store',420000,350000,'["https://picsum.photos/seed/prod14a/600/800","https://picsum.photos/seed/prod14b/600/800"]',0,1,4.00,7,63),
(N'Tui Xach Nu Da PU','tui-xach-nu-da-pu',N'Tui xach nu da PU cao cap thiet ke hien dai',7,'female','Fashion Store',780000,650000,'["https://picsum.photos/seed/prod15a/600/800","https://picsum.photos/seed/prod15b/600/800"]',1,1,4.60,35,80),
(N'Vong Co Nu Bac','vong-co-nu-bac',N'Vong co bac 925 mat da CZ lap lanh',7,'female','Fashion Store',450000,NULL,'["https://picsum.photos/seed/prod16a/600/800","https://picsum.photos/seed/prod16b/600/800"]',0,1,4.80,28,95),
(N'Ao Khoac Bomber Nam','ao-khoac-bomber-nam',N'Ao khoac bomber nam phong cach',0,'male','Fashion Store',1100000,880000,'["https://picsum.photos/seed/prod17a/600/800","https://picsum.photos/seed/prod17b/600/800"]',1,1,4.50,16,40),
(N'Dam Maxi Nu','dam-maxi-nu',N'Dam maxi nu dai thoang mat hoa tiet nhiet doi',4,'female','Fashion Store',850000,720000,'["https://picsum.photos/seed/prod18a/600/800","https://picsum.photos/seed/prod18b/600/800"]',1,1,4.30,21,55);

PRINT 'Products inserted';
