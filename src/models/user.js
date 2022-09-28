const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlenght: 6,
        trime: true,
        validate(value) {
            if(value.toLowerCase().includes('password') || value.length < 7) {
                throw new Error('Password cant be "password" or contained less than 6 characters')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Incorrect format email')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

// Virtual propertie. No actual data stored in DB, is a relationship between 2 entities.

userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

// Method to return public data

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
    
}
// Method to create AuthToken

userSchema.methods.generateAuthToken = async function() {
    const user = this;

    const token = jwt.sign( { _id: user._id.toString() }, process.env.SECRET_JWT_KEY);
    user.tokens = user.tokens.concat({ token });

    await user.save();
    return token;
}


// Creating findByCredentials method. Identify user and check coincidence
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne( { email } )

    if (!user) {
        throw new Error('Unable to login')
    }
    
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Middleware hash password before saving it, in case it has been changed
userSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        
        user.password = await bcrypt.hash(user.password, 8)

    }
    next()
})

// Delete it tasks in case user delete account
userSchema.pre('remove', async function(next) {
    const user = this;

    await Task.deleteMany( { owner: user._id} )
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;