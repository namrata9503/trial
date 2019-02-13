const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const schema = new  mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String},
    hash: { type: String},
    firstName: { type: String},
    lastName: { type: String},
    createdDate: { type: Date, default: Date.now }
});

// schema.set('toJSON', { virtuals: true });
schema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };

module.exports = mongoose.model('User', schema);
