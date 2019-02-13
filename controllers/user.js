const User = require('../models/user');
const crypto = require('crypto');
const jwt = require('jwt-simple');
const moment = require('moment');

function createJwtToken(user) {
  var payload = {
    user: user,
    iat: new Date().getTime(),
    exp: moment().add('days', 7).valueOf()
  };
  return jwt.encode(payload, config.tokenSecret);
}

exports.postNewUser = (req, res) => {
    let {
      firstName,
      lastName,
      
      
      username,
      password,
      createdDate
      
    } = req.body;
  
    var user = new User({
      firstName,
      lastName,
      
      
      username,
      password,
      createdDate
    });
    user.save().then((user) => {
      console.log('Added successfully');
      res.json(user);
    })
  };
  
  
  
  exports.userSignUp = (req, res, next) => {
    var user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password:req.body.password
    });
    user.save(function(err) {
      if (err) return next({
        message: "User registeration failed",
        error: err
      });
      res.json({
        message: "User registered successfully",
        status: 200
      });
    });
  };
  
  exports.userNormalLogin = (req, res, next) => {
    User.findOne({
      username: req.body.username
    }, function(err, user) {
      if (!user) return res.json({
        status: 401,
        message: 'User does not exist'
      });
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) return res.json({status:401, message:'Invalid username and/or password'});
        var token = createJwtToken(user);
        res.json({
          message: "User successfully logged in.",
          status: 200,
          token: token
        });
      });
    });
  };
  exports.getAllUsers = (req, res) => {
    User.find({}, (error, users) => {
      if (error) {
        res.json({
          message: "Server error, Please try after some time.",
          status: 500
        });
      }
      if (users) {
        res.json({
          data: users,
          message: "All users fetched",
          status: 200
        });
      } else {
        res.json({
          message: "No data found",
          status: 200
        });
      }
    });
  };

  exports.getUserById = (req, res) => {
    User.findById(req.params.id, (err, users) => {
      if (err) {
        res.json({
          message: "Server error, Please try after some time.",
          status: 500
        });
      }
      if (users) {
        res.json({
          data: users,
          message: "User data fetched successfully",
          status: 200
        });
      } else {
        res.json({
          message: "No data found",
          status: 200
        });
      }
    });
  };

  exports.updateUserById = (req, res) => {
    console.log(req.body);
    const {
      firstName,
      lastName,
      
      password,
      username,
      createdDate
    } = req.body;
    User.update({
      _id: req.params.id
    }, {
      firstName,
      lastName,
      
      password,
      username,
      createdDate
    }, {}, (error, user) => {
      if (error)
        res.json({
          error: error,
          status: 500
        });
      console.log(error);
      res.json(user);
    });
  };

  exports.deleteUserById = (req, res) => {
    User.findOneAndDelete({
      _id: req.params.id
    }, (error, deleteId) => {
      if (error)
        res.json({
          error: error,
          status: 500
        });
      res.json({
        message: "Deleted successfully"
      });
    });
  };