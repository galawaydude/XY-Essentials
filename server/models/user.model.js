const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pfp: { type: String },
  password: { type: String }, 
  googleId: { type: String }, 
  isAdmin: { type: Boolean, default: false },
  addresses: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Address'
  }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], 
}, { timestamps: true });


userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
