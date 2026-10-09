USE master;
GO
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'FashionStoreDB')
    CREATE DATABASE FashionStoreDB;
GO
USE FashionStoreDB;
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
CREATE TABLE Users (
    Id           INT IDENTITY(1,1) PRIMARY KEY,
    Name         NVARCHAR(100) NOT NULL,
    Email        NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role         NVARCHAR(20)  NOT NULL DEFAULT 'user',
    Phone        NVARCHAR(20)  NULL,
    Avatar       NVARCHAR(500) NULL,
    IsActive     BIT NOT NULL DEFAULT 1,
    CreatedAt    DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Categories' AND xtype='U')
CREATE TABLE Categories (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    Name        NVARCHAR(100) NOT NULL,
    Slug        NVARCHAR(150) NOT NULL UNIQUE,
    Gender      NVARCHAR(20)  NULL,
    Description NVARCHAR(500) NULL,
    Image       NVARCHAR(500) NULL,
    SortOrder   INT NOT NULL DEFAULT 0,
    IsActive    BIT NOT NULL DEFAULT 1
);
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Products' AND xtype='U')
CREATE TABLE Products (
    Id           INT IDENTITY(1,1) PRIMARY KEY,
    Name         NVARCHAR(200)  NOT NULL,
    Slug         NVARCHAR(250)  NOT NULL UNIQUE,
    Description  NVARCHAR(MAX)  NULL,
    CategoryId   INT NULL REFERENCES Categories(Id),
    Gender       NVARCHAR(20)   NULL,
    Brand        NVARCHAR(100)  NULL,
    Price        DECIMAL(18,0)  NOT NULL DEFAULT 0,
    SalePrice    DECIMAL(18,0)  NULL,
    Images       NVARCHAR(MAX)  NULL,
    Tags         NVARCHAR(500)  NULL,
    IsFeatured   BIT NOT NULL DEFAULT 0,
    IsNewArrival BIT NOT NULL DEFAULT 0,
    Rating       DECIMAL(3,2)   NOT NULL DEFAULT 0,
    NumReviews   INT NOT NULL DEFAULT 0,
    Sold         INT NOT NULL DEFAULT 0,
    IsActive     BIT NOT NULL DEFAULT 1,
    CreatedAt    DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ProductVariants' AND xtype='U')
CREATE TABLE ProductVariants (
    Id        INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL REFERENCES Products(Id) ON DELETE CASCADE,
    Color     NVARCHAR(50) NULL,
    Size      NVARCHAR(20) NULL,
    Stock     INT NOT NULL DEFAULT 0
);
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Carts' AND xtype='U')
CREATE TABLE Carts (
    Id        INT IDENTITY(1,1) PRIMARY KEY,
    UserId    INT NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT UQ_Cart_User UNIQUE (UserId)
);
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='CartItems' AND xtype='U')
CREATE TABLE CartItems (
    Id        INT IDENTITY(1,1) PRIMARY KEY,
    CartId    INT NOT NULL REFERENCES Carts(Id) ON DELETE CASCADE,
    ProductId INT NULL REFERENCES Products(Id),
    Name      NVARCHAR(200) NOT NULL,
    Image     NVARCHAR(500) NULL,
    Price     DECIMAL(18,0) NOT NULL,
    Color     NVARCHAR(50)  NULL,
    Size      NVARCHAR(20)  NULL,
    Quantity  INT NOT NULL DEFAULT 1
);
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Orders' AND xtype='U')
CREATE TABLE Orders (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    UserId        INT NULL REFERENCES Users(Id),
    OrderNumber   NVARCHAR(20)  NOT NULL UNIQUE,
    FullName      NVARCHAR(100) NOT NULL,
    Phone         NVARCHAR(20)  NOT NULL,
    Street        NVARCHAR(200) NOT NULL,
    District      NVARCHAR(100) NULL,
    City          NVARCHAR(100) NOT NULL,
    PaymentMethod NVARCHAR(50)  NOT NULL DEFAULT 'cod',
    OrderStatus   NVARCHAR(30)  NOT NULL DEFAULT 'pending',
    TotalPrice    DECIMAL(18,0) NOT NULL DEFAULT 0,
    ShippingFee   DECIMAL(18,0) NOT NULL DEFAULT 0,
    Note          NVARCHAR(500) NULL,
    CreatedAt     DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='OrderItems' AND xtype='U')
CREATE TABLE OrderItems (
    Id        INT IDENTITY(1,1) PRIMARY KEY,
    OrderId   INT NOT NULL REFERENCES Orders(Id) ON DELETE CASCADE,
    ProductId INT NULL REFERENCES Products(Id),
    Name      NVARCHAR(200) NOT NULL,
    Image     NVARCHAR(500) NULL,
    Price     DECIMAL(18,0) NOT NULL,
    Quantity  INT NOT NULL DEFAULT 1,
    Color     NVARCHAR(50)  NULL,
    Size      NVARCHAR(20)  NULL
);
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Reviews' AND xtype='U')
CREATE TABLE Reviews (
    Id        INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL REFERENCES Products(Id) ON DELETE CASCADE,
    UserId    INT NOT NULL REFERENCES Users(Id),
    Rating    INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comment   NVARCHAR(1000) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Wishlist' AND xtype='U')
CREATE TABLE Wishlist (
    UserId    INT NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
    ProductId INT NOT NULL REFERENCES Products(Id),
    PRIMARY KEY (UserId, ProductId)
);
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserAddresses' AND xtype='U')
CREATE TABLE UserAddresses (
    Id        INT IDENTITY(1,1) PRIMARY KEY,
    UserId    INT NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
    FullName  NVARCHAR(100) NOT NULL,
    Phone     NVARCHAR(20)  NOT NULL,
    Street    NVARCHAR(200) NOT NULL,
    District  NVARCHAR(100) NULL,
    City      NVARCHAR(100) NOT NULL,
    IsDefault BIT NOT NULL DEFAULT 0
);
GO
PRINT 'FashionStoreDB schema created OK';
