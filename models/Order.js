const mongoose = require('mongoose')

const SingleOrderSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide order name'],
  },
  image: {
    type: String,
    required: [true, 'Please provide order image'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide order price'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide order qty'],
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Please provide product id'],
  },
})

const OrderSchema = mongoose.Schema(
  {
    tax: {
      type: Number,
      required: [true, 'Please Provide the tax'],
    },
    shippingFee: {
      type: Number,
      required: [true, 'Please Provide the tax'],
    },
    subtotal: {
      type: Number,
      required: [true, 'Please Provide the subtotal'],
    },
    total: {
      type: Number,
      required: [true, 'Please Provide the total'],
    },
    orderItems: [SingleOrderSchema],
    status: {
      type: String,
      enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
      default: 'pending',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    clientSecret: {
      type: String,
      required: [true, 'Please provide cilent secret'],
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamp: true }
)

module.exports = mongoose.model('Order', OrderSchema)
