const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  image: String,
  price: { type: Number, required: true },
  color: String,
  size: String,
  quantity: { type: Number, required: true, min: 1 }
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  district: String,
  city: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  orderCode: { type: String, unique: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    enum: ['cod', 'bank_transfer', 'momo'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'],
    default: 'pending'
  },
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 30000 },
  totalPrice: { type: Number, required: true },
  note: String,
  cancelReason: String
}, { timestamps: true });

orderSchema.pre('save', function(next) {
  if (!this.orderCode) {
    this.orderCode = 'FS' + Date.now().toString().slice(-8);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
