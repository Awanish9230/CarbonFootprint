const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    state: { type: String, default: '' },
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }]
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = async function (password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

module.exports = mongoose.model('User', userSchema);
