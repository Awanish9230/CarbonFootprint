const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  state: { type: String, default: '' },
  photoURL: { type: String, default: '' },
  rank: { type: String, default: 'Beginner' },
  posts: { type: Number, default: 0 },
  goals: [
    {
      text: { type: String, required: true },
      completed: { type: Boolean, default: false }
    }
  ],
  communityActivity: { type: String, default: '' },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }]
});

// Compare password
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Hash password
userSchema.statics.hashPassword = async function(password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);
