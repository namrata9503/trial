const User = require('../models/user');
const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config');
const crypto = require('crypto');

function createJwtToken(user) {
  var payload = {
    user: user._id,
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
      email,
      password,
      createdDate
      
    } = req.body;
  
    var user = new User({
      firstName,
      lastName,
      
      username,
      email,
      
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
      email: req.body.email,
      password:req.body.password
    });
    user.save(function(err) {
      console.log(user)
      console.log(err)

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
  exports.getCurrentUser = (req, res, next) => {
    res.json({
      user: req.user
    })
  }


  exports.userLogin = (req, res, next) => {
    console.log(req.body)
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      //console.log(err)
      if (!user) return res.json({
        status: 401,
        message: 'User does not exist'
      });
      user.comparePassword(req.body.password, function(err, isMatch) {
       console.log(err)
        if (!isMatch) return res.json({status:401, message:'Invalid email and/or password'});
        var token = createJwtToken(user);
        console.log(user)
        res.json({
          message: "User successfully logged in.",
          status: 200,
          token: token
        });
      });
    });
  };
  exports.ensureAuthenticated = (req, res, next) => {
    if (req.headers.authorization) {
      var token = req.headers.authorization.split(' ')[1];
      try {
        var decoded = jwt.decode(token, config.tokenSecret);
        if (decoded.exp <= Date.now()) {
          res.send(400, 'Access token has expired');
        } else {
          req.user = decoded.user;
          return next();
        }
      } catch (err) {
        console.log(token)
        return res.send(500, 'Error parsing token');
      }
    } else {
      return res.send(401);
    }
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