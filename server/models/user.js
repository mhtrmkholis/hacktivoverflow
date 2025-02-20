const mongoose = require('mongoose');
const { Schema } = mongoose;
const Helper = require('../helpers/helper');

const userSchema = new Schema({
  username: {
    type: String,
    required: [ true, 'Username can not be blank' ]
  },
  email: {
    type: String,
    required: [ true, 'Email can not be blank' ],
    unique: true,
    validate: [
      {
        validator: (email) => {
          return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)
        }, 
        message: 'Invalid email format'
      },
      {
        validator: function (email) {
          return new Promise(function (resolve, reject) {
            User.findOne({ email })
              .then(data => !data ? resolve(true) : resolve(false))
              .catch(err => reject(err));
          });
        },
        message: props => `${props.value} already registered`
      }
    ]
  },
  password: {
      type: String,
      required: true,
      minlength: [4, 'Password min length is 4'],
  }
}, { timestamps: true });

userSchema.pre('save', function(next, done) {
  this.password = Helper.hashPassword(this.password);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;