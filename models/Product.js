const mongoose = require('mongoose');
const slugify = require('slugify');

const variantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  colorCode: { type: String, default: '#000000' },
  size: { type: String, required: true },
  stock: { type: Number, default: 0, min: 0 }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên sản phẩm'],
    trim: true
  },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unisex'],
    required: true
  },
  brand: { type: String, default: 'Fashion Store' },
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  images: [{ type: String }],
  variants: [variantSchema],
  tags: [String],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isNewArrival: { type: Boolean, default: false }
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, locale: 'vi' }) + '-' + Date.now();
  }
  if (this.price && this.salePrice) {
    this.discount = Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  next();
});

productSchema.virtual('finalPrice').get(function() {
  return this.salePrice || this.price;
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
