
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    payment: { type: mongoose.Schema.Types.Mixed },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    timestamp: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
