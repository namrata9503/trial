const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const schema = new  mongoose.Schema({
  username:{ type: String},
    email: { type: String, unique: true },
    password: { type: String},
    hash: { type: String},
    firstName: { type: String},
    type: { type: String, default: 'user'},
    lastName: { type: String},
    createdDate: { type: Date, default: Date.now }
});

// schema.set('toJSON', { virtuals: true });
schema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      console.log("errror at model",err)
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };
  schema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  });
module.exports = mongoose.model('User', schema);
