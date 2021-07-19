const User = require('../models/users.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.postAddUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password
  User.findOne({
      email: email
    })
    .then(user => {
      if (user) {
        return res.status(404).json({
          message: 'Email already exist!'
        })
      }
      return bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const newUser = new User({
            email: email,
            password: hashedPassword
          });
          return newUser.save()
            .then(result => {
              res.status(200).json({
                message: 'Registration successful',
                user: result
              })
            })
            .catch(err => {
              res.status(500).json({
                message: err
              })
            })
        })
        .catch(err => {
          res.status(500).json({
            message: err
          })
        })
    })
    .catch(err => {
      res.status(500).json({
        message: err
      })
    })
}
exports.getUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
      email: email
    })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Email or Password incorrect!'
        })
      }
      return bcrypt.compare(password, user.password) 
        .then(doMatch => {
          if (!doMatch) {
            return res.status(401).json({
              message: 'Email or Password incorrect!'
            })
          }
          const token = jwt.sign({
            email: user.email,
            userId: user._id
          }, process.env.JWT_KEY, {
            expiresIn: '1h'
          });
          res.status(200).json({
              token : token,
              expiresIn : 3600,
              userId : user._id
          })
        })
        .catch(err => {
          res.status(500).json({
            message: err
          })
        })
    })
    .catch(err => {
      res.status(500).json({
        message: err
      })
    })
}
