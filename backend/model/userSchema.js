const mongoose = require('mongoose')
const { Schema } = mongoose;
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    name:  {
        type: String,
        required: [true, 'User name is required'],
        minLength: [5, 'Name must be at least 5 character'],
        maxLength: [50, 'Name must be less than 50 character'],
        trim: true,

    },
    email: {
        type: String,
        required: [true, 'User email is required'],
        unique: true,
        lowercase: true,
        unique: [true, 'Already registered']

    },
    password: {
        type: String,
        select: false

    },
    forgotPasswordToken: {
        type: String,

    },
    forgotPasswordExpiryDate: {
        type: Date
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
    return;
})

//create token
userSchema.methods = {
    jwtToken() {
        return JWT.sign(
            { id: this._id, email: this.email },
            process.env.SECRET,
            { expiresIn: '24h' }
        )
    }
}

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;