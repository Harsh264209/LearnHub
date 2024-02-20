
// userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email:{type:String,required:true},
  answer:{type:String,required:true},
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});


if (mongoose.models.User) {
  module.exports = mongoose.model('User');
} else {
  const User = mongoose.model('User', userSchema);
  module.exports = User;
}

// const User = mongoose.model('User', userSchema);

// module.exports = User;
